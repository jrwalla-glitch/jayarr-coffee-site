<script>
  // ConnectorPipe — copper pipes connecting apparatus sections
  // Horizontal on desktop, vertical on mobile
  // Concept art ref: 00-apparatus-v3-final.png (pipes between sections)
  import { isMobile } from './store.js';
</script>

<div class="connector-pipe">
  {#if $isMobile}
    <!-- Vertical pipe -->
    <svg viewBox="0 0 30 50" xmlns="http://www.w3.org/2000/svg" class="pipe-svg vertical">
      <!-- Outer pipe -->
      <line x1="15" y1="0" x2="15" y2="50"
        stroke="#B8860B" stroke-width="6" stroke-linecap="round" />
      <!-- Inner highlight -->
      <line x1="13" y1="2" x2="13" y2="48"
        stroke="#D4A847" stroke-width="1.5" opacity="0.4" />
      <!-- Connector rings -->
      <ellipse cx="15" cy="5" rx="5" ry="2" fill="none" stroke="#8B5E2B" stroke-width="1" />
      <ellipse cx="15" cy="45" rx="5" ry="2" fill="none" stroke="#8B5E2B" stroke-width="1" />
    </svg>
  {:else}
    <!-- Horizontal pipe -->
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg" class="pipe-svg horizontal">
      <!-- Outer pipe -->
      <line x1="0" y1="15" x2="60" y2="15"
        stroke="#B8860B" stroke-width="6" stroke-linecap="round" />
      <!-- Inner highlight -->
      <line x1="2" y1="13" x2="58" y2="13"
        stroke="#D4A847" stroke-width="1.5" opacity="0.4" />
      <!-- Connector rings -->
      <ellipse cx="5" cy="15" rx="2" ry="5" fill="none" stroke="#8B5E2B" stroke-width="1" />
      <ellipse cx="55" cy="15" rx="2" ry="5" fill="none" stroke="#8B5E2B" stroke-width="1" />
    </svg>
  {/if}
</div>

<style>
  .connector-pipe {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pipe-svg.horizontal {
    width: 60px;
    height: 30px;
  }
  .pipe-svg.vertical {
    width: 30px;
    height: 50px;
  }
</style>
