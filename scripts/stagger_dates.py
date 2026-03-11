#!/usr/bin/env python3
"""
stagger_dates.py

Spreads updatedDate values across Nov 2025 – Mar 2026 for 93 older blog posts,
leaving the 11 Origin Cap articles published today at Mar 10 2026.

Distribution targets:
  Nov 2025:        ~15 posts
  Dec 2025:        ~15 posts
  Jan 2026:        ~20 posts
  Feb 2026:        ~20 posts
  Mar 2026 1-10:   ~23 posts
"""

import os
import re
from datetime import date, timedelta
import random

BLOG_DIR = "/Users/johnwallace/Documents/Claude Projects/Project 1/JayArr Coffee/jayarr-coffee-site/src/content/blog"

# The 11 Origin Cap articles published today — keep untouched
KEEP_TODAY = {
    "bolivia-coffee-rare-hidden-gem",
    "china-yunnan-coffee-emerging-origin",
    "coffee-varieties-explained",
    "el-salvador-coffee-guide-pacamara",
    "honduras-coffee-guide-marcala-comayagua",
    "malawi-coffee-africas-hidden-gem",
    "moka-pot-brewing-guide",
    "myanmar-coffee-shan-state",
    "panama-coffee-guide-geisha-boquete",
    "peru-coffee-guide-chanchamayo",
    "yemen-coffee-guide-mocha-origin",
}

# ── Build the date pool ──────────────────────────────────────────────────────
# We want 93 dates spread believably. We'll generate candidate dates in each
# window weighted toward mid-month and weekdays (Mon-Fri), then sample without
# replacement to fill each bucket.

def generate_window_dates(year: int, month: int, day_start: int, day_end: int) -> list[date]:
    """Return all dates in [day_start, day_end] for the given month/year."""
    dates = []
    d = date(year, month, day_start)
    end = date(year, month, day_end)
    while d <= end:
        dates.append(d)
        d += timedelta(days=1)
    return dates


def weighted_sample(dates: list[date], n: int, seed: int) -> list[date]:
    """
    Sample n dates from the list, preferring weekdays (Mon-Fri).
    Weekdays get weight 3, weekends get weight 1.
    Uses a fixed seed so the output is deterministic.

    If n >= len(dates) (e.g. the March 1-10 window with 23 posts needed),
    we allow multiple posts per day by returning n dates with repeats spread
    evenly across the window.
    """
    rng = random.Random(seed)

    if n <= len(dates):
        # Standard case: enough unique days available
        weights = [3 if d.weekday() < 5 else 1 for d in dates]
        # Use sample-without-replacement via shuffle of weighted list
        weighted_pool = []
        for d, w in zip(dates, weights):
            weighted_pool.extend([d] * w)
        rng.shuffle(weighted_pool)
        seen = set()
        result = []
        for d in weighted_pool:
            if d not in seen:
                seen.add(d)
                result.append(d)
            if len(result) == n:
                break
        # Safety pad if still short (shouldn't happen in normal case)
        if len(result) < n:
            remaining = [d for d in dates if d not in seen]
            rng.shuffle(remaining)
            result.extend(remaining[:n - len(result)])
    else:
        # More posts than days: allow multiple posts per day.
        # Distribute n posts across available dates using weighted selection.
        weights = [3 if d.weekday() < 5 else 1 for d in dates]
        result = rng.choices(dates, weights=weights, k=n)

    return sorted(result)


# Month windows and target counts (must sum to 93)
BUCKETS = [
    {"year": 2025, "month": 11, "day_start": 1,  "day_end": 30, "count": 15, "seed": 1001},
    {"year": 2025, "month": 12, "day_start": 1,  "day_end": 31, "count": 15, "seed": 1002},
    {"year": 2026, "month":  1, "day_start": 1,  "day_end": 31, "count": 20, "seed": 1003},
    {"year": 2026, "month":  2, "day_start": 1,  "day_end": 28, "count": 20, "seed": 1004},
    {"year": 2026, "month":  3, "day_start": 1,  "day_end":  9, "count": 23, "seed": 1005},
]

assert sum(b["count"] for b in BUCKETS) == 93, "Bucket counts must sum to 93"

date_pool: list[date] = []
for bucket in BUCKETS:
    window = generate_window_dates(bucket["year"], bucket["month"], bucket["day_start"], bucket["day_end"])
    sampled = weighted_sample(window, bucket["count"], bucket["seed"])
    date_pool.extend(sampled)

# Sort the full pool so dates are globally ordered
date_pool.sort()

assert len(date_pool) == 93, f"Expected 93 dates, got {len(date_pool)}"

# ── Gather the 93 posts alphabetically ──────────────────────────────────────
all_files = sorted(
    f for f in os.listdir(BLOG_DIR) if f.endswith(".mdx")
)

slugs_to_process = []
for filename in all_files:
    slug = filename[:-4]  # strip .mdx
    if slug not in KEEP_TODAY:
        slugs_to_process.append(filename)

assert len(slugs_to_process) == 93, (
    f"Expected 93 posts to process, got {len(slugs_to_process)}. "
    f"Check KEEP_TODAY list matches actual filenames."
)

# ── Format helper ────────────────────────────────────────────────────────────
MONTH_ABBR = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
    5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
    9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
}

def format_date(d: date) -> str:
    """Format as 'Mon DD YYYY' e.g. 'Nov 15 2025'"""
    return f"{MONTH_ABBR[d.month]} {d.day:02d} {d.year}"

# ── Apply updates ────────────────────────────────────────────────────────────
UPDATED_DATE_RE = re.compile(r'^(updatedDate:\s*")[^"]*(")', re.MULTILINE)

changed = []
skipped_no_match = []

for filename, assigned_date in zip(slugs_to_process, date_pool):
    filepath = os.path.join(BLOG_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_date_str = format_date(assigned_date)
    new_line = rf'\g<1>{new_date_str}\g<2>'

    new_content, n_subs = UPDATED_DATE_RE.subn(new_line, content)

    if n_subs == 0:
        skipped_no_match.append(filename)
        continue

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        changed.append((filename, new_date_str))

# ── Report ───────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
print(f"  stagger_dates.py — Results")
print(f"{'='*60}")
print(f"\nKept at Mar 10 2026 ({len(KEEP_TODAY)} posts):")
for slug in sorted(KEEP_TODAY):
    print(f"  [KEPT]  {slug}.mdx")

print(f"\nUpdated ({len(changed)} posts):")
for filename, new_date in changed:
    print(f"  [UPDATED]  {filename:<65} → {new_date}")

if skipped_no_match:
    print(f"\nSkipped — no updatedDate field found ({len(skipped_no_match)}):")
    for f in skipped_no_match:
        print(f"  [SKIP]  {f}")

# Date distribution summary
from collections import Counter
month_counts: Counter = Counter()
for _, d_str in changed:
    parts = d_str.split()
    month_counts[f"{parts[0]} {parts[2]}"] += 1

print(f"\nDate distribution:")
for month_key in ["Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"]:
    print(f"  {month_key}: {month_counts.get(month_key, 0)} posts")

print(f"\nTotal posts in blog: {len(all_files)}")
print(f"Posts updated:       {len(changed)}")
print(f"Posts kept today:    {len(KEEP_TODAY)}")
print(f"No updatedDate:      {len(skipped_no_match)}")
print()
