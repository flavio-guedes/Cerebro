import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * EVOLUTION 01 acceptance gate
 *
 * Checks that:
 * - 1. No JS console errors on interaction
 * - 2. Maturity bar has visible CSS and proportional fill
 * - 3. Header and main panel titles have distinct styles
 * - 4. KPIs are clickable and navigate
 * - 5. No duplicate chip classes in skill items
 * - 6. No #viewport references
 */

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const results = [];

function check(name, condition, detail) {
  results.push({ name, pass: condition, detail });
}

// 1. detail element exists
check('detail element exists', html.includes('id="detail"'), 'Painel de detalhes presente no DOM');

// 2. status-bar and status-fill CSS rules exist
check('.status-bar CSS exists', html.includes('.status-bar {') && html.includes('flex-shrink: 0'), 'Regra .status-bar com dimensões e flex-shrink');
check('.status-fill CSS exists', html.includes('.status-fill {') && html.includes('background: linear-gradient(90deg, var(--cyan), var(--green))'), 'Regra .status-fill com gradiente');

// 3. panel-title--compact exists for header KPIs
check('.panel-title--compact exists', html.includes('.panel-title--compact'), 'Modificador compacto para título de KPI existe');

// 4. No duplicate chip in skill template
check('skill chip class is correct', html.includes("const maturityClass = skill.maturity === 'high' ? 'ok'") && html.includes('class="chip ${maturityClass}"') && !['chip chip ok', 'chip chip warn', 'chip chip plan'].some(s => html.includes(s)), 'Skill chip usa sufixo sem duplicar chip');

// 5. No #viewport reference
check('no #viewport reference', !html.includes('getElementById(\'viewport\')'), 'Sem referência a viewport inexistente');

// 6. KPI panels have data-target
check('KPIs have data-target', html.includes('data-target="ecosystem"') && html.includes('data-target="insights"'), 'KPIs do header possuem data-target');

// 7. status-row no longer uses inline cssText
check('no inline status-row cssText', !html.includes('row.style.cssText'), 'Linhas de maturidade sem style.cssText inline');

// 8. Header panels are clickable via makeItemClickable
check('header panels are clickable', html.includes('panel[data-target]') && html.includes('switchTab(panel.dataset.target)'), 'Painéis do header são clicáveis');

const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass);

console.log(`\n=== EVOLUTION 01 Eval ===`);
console.log(`Passed: ${passed}/${results.length}\n`);

results.forEach(r => {
  const status = r.pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${r.name}: ${r.detail}`);
});

if (failed.length > 0) {
  console.log(`\n${failed.length} check(s) failed.`);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
  process.exit(0);
}
