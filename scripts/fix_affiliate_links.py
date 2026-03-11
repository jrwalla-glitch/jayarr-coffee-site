#!/usr/bin/env python3
"""
fix_affiliate_links.py

Converts Markdown-style Amazon affiliate links to JSX <a> tags with
rel="sponsored noopener" across all .mdx blog posts.

Target pattern: [text](https://www.amazon.com/...tag=jayarrcoffee-20...)
Output:         <a href="https://www.amazon.com/...tag=jayarrcoffee-20..." rel="sponsored noopener">text</a>

Rules:
- Only convert Markdown links [text](url) where url contains amazon.com AND tag=jayarrcoffee-20
- Skip links already in <a> tag format (none found in current corpus, but defensive)
- Skip Amazon links inside JSX component props (attribute values), e.g., inside ComparisonTable
- Report per-file conversion counts
"""

import re
import sys
from pathlib import Path

BLOG_DIR = Path(__file__).parent.parent / "src" / "content" / "blog"

# Matches a Markdown link [any text](url) where url contains amazon.com and tag=jayarrcoffee-20
# Uses a non-greedy match for the URL and handles parentheses in text.
# The URL match stops at the closing ) but must not cross line boundaries.
MD_LINK_PATTERN = re.compile(
    r'\[([^\]]*)\]'           # [link text] — capture group 1
    r'\('                      # literal (
    r'(https?://(?:www\.)?amazon\.com[^)]*tag=jayarrcoffee-20[^)]*)'  # url — capture group 2
    r'\)'                      # literal )
)

def is_inside_jsx_prop(line: str, match_start: int) -> bool:
    """
    Detect if the match is inside a JSX component attribute value.

    In MDX, JSX props look like:
        prop="value [text](url) value"
        prop={`[text](url)`}

    Heuristic: if the match is preceded on the same line by an unmatched
    JSX attribute opener (attribute=" or attribute={), we consider it inside
    a JSX prop and skip it.

    For the current corpus, Amazon affiliate links only appear in prose, so
    this is purely defensive. The approach: scan from line start to match_start
    and count quote contexts opened by JSX-style attribute patterns.
    """
    prefix = line[:match_start]

    # Simpler heuristic: if the entire line starts with whitespace then contains
    # a JSX attribute pattern like `  prop="` before the match, treat as prop.
    # JSX component invocations start with < or are indented attribute lines.
    # A standalone prose line won't have `="` before the link.
    #
    # Check: does the prefix contain an odd number of double-quotes following
    # a word boundary `=` (JSX attribute assignment)?
    jsx_attr_pattern = re.compile(r'\w+\s*=\s*["{`]')
    if jsx_attr_pattern.search(prefix):
        return True

    return False


def convert_file(path: Path) -> int:
    """
    Process a single .mdx file. Returns the number of links converted.
    """
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines(keepends=True)
    total_converted = 0
    new_lines = []

    for line in lines:
        # Quick check: skip lines with no affiliate tag at all
        if "tag=jayarrcoffee-20" not in line:
            new_lines.append(line)
            continue

        # Find all Markdown affiliate links in this line
        matches = list(MD_LINK_PATTERN.finditer(line))
        if not matches:
            # Has tag but no markdown link pattern (e.g., existing <a> tag or bare URL)
            new_lines.append(line)
            continue

        # Process matches right-to-left so positions stay valid after substitution
        modified_line = line
        converted_count = 0
        for match in reversed(matches):
            start = match.start()
            end = match.end()

            # Recompute start position in modified_line — since we go right-to-left,
            # positions before this match are unchanged.
            if is_inside_jsx_prop(modified_line, start):
                # Skip — inside a JSX attribute value
                continue

            link_text = match.group(1)
            url = match.group(2)
            replacement = f'<a href="{url}" rel="sponsored noopener">{link_text}</a>'
            modified_line = modified_line[:start] + replacement + modified_line[end:]
            converted_count += 1

        new_lines.append(modified_line)
        total_converted += converted_count

    if total_converted > 0:
        new_content = "".join(new_lines)
        path.write_text(new_content, encoding="utf-8")

    return total_converted


def main():
    mdx_files = sorted(BLOG_DIR.glob("*.mdx"))

    if not mdx_files:
        print(f"No .mdx files found in {BLOG_DIR}")
        sys.exit(1)

    print(f"Scanning {len(mdx_files)} .mdx files in {BLOG_DIR}\n")

    grand_total = 0
    files_modified = 0

    for path in mdx_files:
        count = convert_file(path)
        if count > 0:
            print(f"  {path.name}: {count} link(s) converted")
            grand_total += count
            files_modified += 1

    print(f"\n{'='*60}")
    print(f"Done. {grand_total} link(s) converted across {files_modified} file(s).")
    print(f"({len(mdx_files) - files_modified} files had no affiliate links to convert.)")


if __name__ == "__main__":
    main()
