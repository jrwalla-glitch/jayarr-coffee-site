<script>
  // RecipeGauges — 4 parameter gauges along the connector pipe
  // Thermometer (temp) + Dial (grind) + Slider (ratio) + Slider (time)
  import ThermometerGauge from './ThermometerGauge.svelte';
  import DialGauge from './DialGauge.svelte';
  import SliderGauge from './SliderGauge.svelte';
  import { recipe } from './store.js';

  let r = $derived($recipe);
</script>

<div class="recipe-gauges">
  {#if r}
    <div class="gauge-item">
      <ThermometerGauge
        value={r.temp_c?.start ?? 93}
        min={r.temp_c?.min ?? 90}
        max={r.temp_c?.max ?? 96}
        label="Temp"
        unit="°C"
      />
    </div>

    <div class="gauge-item">
      <DialGauge
        value={r.grind_um?.start ?? 500}
        min={r.grind_um?.min ?? 400}
        max={r.grind_um?.max ?? 600}
        label="Grind"
        unit="μm"
      />
    </div>

    <div class="gauge-item">
      <SliderGauge
        value={r.ratio?.start ?? 15.5}
        min={r.ratio?.min ?? 14}
        max={r.ratio?.max ?? 17}
        label="Ratio"
        unit=""
        displayValue={r.ratio_display ?? `1:${r.ratio?.start ?? 15.5}`}
      />
    </div>

    <div class="gauge-item">
      <SliderGauge
        value={0.5}
        min={0}
        max={1}
        label="Time"
        unit=""
        displayValue={r.time_display ?? '3:00-4:00'}
      />
    </div>
  {:else}
    <!-- Empty state gauges -->
    <div class="gauge-item">
      <ThermometerGauge value={0} min={0} max={0} label="Temp" unit="°C" />
    </div>
    <div class="gauge-item">
      <DialGauge value={500} min={500} max={500} label="Grind" unit="μm" />
    </div>
    <div class="gauge-item">
      <SliderGauge value={0.5} min={0} max={1} label="Ratio" displayValue="[?]" />
    </div>
    <div class="gauge-item">
      <SliderGauge value={0.5} min={0} max={1} label="Time" displayValue="[?]" />
    </div>
  {/if}
</div>

<style>
  .recipe-gauges {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .gauge-item {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .recipe-gauges {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      align-items: center;
    }
  }
</style>
