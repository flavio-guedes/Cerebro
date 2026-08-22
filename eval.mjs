import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * EVOLUTION 01-03 acceptance gate
 */

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const results = [];

function check(name, condition, detail) {
  results.push({ name, pass: condition, detail });
}

// EVOLUTION 01 checks
check('detail element exists', html.includes('id="detail"'), 'Painel de detalhes presente no DOM');
check('.status-bar CSS exists', html.includes('.status-bar {') && html.includes('flex-shrink: 0'), 'Regra .status-bar com dimensões e flex-shrink');
check('.status-fill CSS exists', html.includes('.status-fill {') && html.includes('background: linear-gradient(90deg, var(--cyan), var(--green))'), 'Regra .status-fill com gradiente');
check('.panel-title--compact exists', html.includes('.panel-title--compact'), 'Modificador compacto para título de KPI existe');
check('skill chip class is correct', html.includes("const maturityClass = skill.maturity === 'high' ? 'ok'") && html.includes('class="chip ${maturityClass}"') && !['chip chip ok', 'chip chip warn', 'chip chip plan'].some(s => html.includes(s)), 'Skill chip usa sufixo sem duplicar chip');
check('no #viewport reference', !html.includes("getElementById('viewport')"), 'Sem referência a viewport inexistente');
check('KPIs have data-target', html.includes('data-target="ecosystem"') && html.includes('data-target="insights"'), 'KPIs do header possuem data-target');
check('no inline status-row cssText', !html.includes('row.style.cssText'), 'Linhas de maturidade sem style.cssText inline');
check('header panels are clickable', html.includes('panel[data-target]') && html.includes('switchTab(panel.dataset.target)'), 'Painéis do header são clicáveis');

// EVOLUTION 02 checks
check('competencies tab exists', html.includes('data-tab="competencies"'), 'Aba Competências existe');
check('competencies render function exists', html.includes('function renderCompetencies()'), 'Função de renderização de competências existe');
check('radar shows data context', html.includes('Maturidade média') && html.includes('Ecossistema') && html.includes('Próximos passos'), 'Raio-X mostra ecossistema, maturidade média, alertas e próximos passos');

// EVOLUTION 03 checks
check('severity classes exist', html.includes('severity-high') && html.includes('severity-mid') && html.includes('severity-low'), 'Classes de severidade visual existem');
check('insights use severity classes', html.includes('severity-${ins.severity}'), 'Insights aplicam classe de severidade');
check('high severity is visually distinct', html.includes('box-shadow') && html.includes('rgba(248,113,113,0.15)'), 'Severidade alta tem destaque visual');
check('insights are sorted by severity', html.includes("order[a.severity] ?? 9") && html.includes("order[b.severity] ?? 9"), 'Insights são ordenados por severidade');
check('KPIs have contextual subtext', html.includes('metric-ecosystem-sub') && html.includes('metric-skills-sub') && html.includes('metric-frameworks-sub') && html.includes('metric-alerts-sub'), 'KPIs possuem subtítulo contextual');
check('alerts KPI has context', html.includes('crítico(s)'), 'KPI de alertas mostra contagem crítica');

const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass);

console.log(`\n=== EVOLUTION 01-03 Eval ===`);
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
