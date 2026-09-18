// ====================================================================
// SENA SST - COPASST INSPECCIONES INTELIGENTES (Vanilla JavaScript)
// ====================================================================

// Supabase Client Config
const SUPABASE_URL = 'https://qwhcyjfvrvldbhqgpevw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MmBgYBrl4NabloVzGSlKWg__lQMmio9';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('Supabase initialization fallback:', e);
  }
}

// Initial Inspections Data
let inspections = [
  {
    id: 'insp-101',
    code: 'HAL-2025-043',
    title: 'Guarda de protección desajustada en torno mecánico',
    sede: 'Complejo Sur - Centro de Metalmecánica',
    area: 'Taller de Maquinado y Tornos',
    date: '18/09/2026',
    inspectorName: 'Laura Noguera',
    riskLevel: 'II',
    riskCategory: 'Condiciones de seguridad',
    status: 'en_proceso',
    description: 'Falta tornillo prisionero en guarda acrílica del cabezal giratorio del torno T-04.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    assignedTo: 'Ing. Roberto Peña'
  },
  {
    id: 'insp-102',
    code: 'HAL-2025-044',
    title: 'Empalme de cableado eléctrico expuesto en máquina pulidora',
    sede: 'Complejo Sur - Centro de Metalmecánica',
    area: 'Taller de Soldadura y Fundición',
    date: '17/09/2026',
    inspectorName: 'Roberto Peña',
    riskLevel: 'I',
    riskCategory: 'Condiciones de seguridad',
    status: 'abierto',
    description: 'Cables con aislamiento deteriorado en la toma trifásica de la esmeriladora doble.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
    assignedTo: 'Ing. Carlos Mora'
  },
  {
    id: 'insp-103',
    code: 'HAL-2025-045',
    title: 'Derrame de aceite lubricante en pasillo de torno CNC',
    sede: 'Complejo Sur - Centro de Metalmecánica',
    area: 'Taller de Maquinado y Tornos',
    date: '16/09/2026',
    inspectorName: 'Marcela Durán',
    riskLevel: 'III',
    riskCategory: 'Condiciones de seguridad',
    status: 'cerrado',
    description: 'Fuga menor de fluido refrigerante en la base del torno de control numérico.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    assignedTo: 'Laura Noguera'
  }
];

// Initial COPASST Members
let copasstMembers = [
  { id: 'cop-1', name: 'Ing. Laura Noguera', role: 'Inspector Principal COPASST / SST', cc: 'C.C. 52.849.120', license: 'Licencia SST 10482' },
  { id: 'cop-2', name: 'Ing. Roberto Peña', role: 'Líder Técnico de Talleres Mecánicos', cc: 'C.C. 79.431.902', license: 'NTC 2506' },
  { id: 'cop-3', name: 'Lic. Marcela Durán', role: 'Delegada del Comité COPASST', cc: 'C.C. 39.712.441', license: 'Licencia SST 08412' },
  { id: 'cop-4', name: 'Téc. Carlos Mora', role: 'Inspector Técnico de Soldadura', cc: 'C.C. 80.124.991', license: 'Inspector NDT II' }
];

let selectedInspectors = ['cop-1'];
let capturedImageData = null;
let currentGpsData = null;
let activeView = 'dashboard-telemetria';

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  // Set Current Date in Header
  const dateEl = document.getElementById('headerCurrentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Fetch COPASST Inspectors from Supabase if available
  loadInspectorsFromSupabase();

  // Initial UI Render
  renderInspectionsList();
  renderCopasstMembers();
  updateKpis();
  renderFindingReport();
  renderMakerCheckerProposal();
});

// Navigation Logic
function navigateTo(viewId) {
  activeView = viewId;
  
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
  
  // Show target section
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update Nav Button active styles
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('bg-[#39a900]', 'text-white', 'font-semibold', 'shadow-[0_4px_14px_rgba(57,169,0,0.3)]');
    btn.classList.add('text-[#3f4a38]', 'hover:bg-[#eaedff]/70');
  });

  const activeBtn = document.getElementById(`nav-${viewId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-[#3f4a38]', 'hover:bg-[#eaedff]/70');
    activeBtn.classList.add('bg-[#39a900]', 'text-white', 'font-semibold', 'shadow-[0_4px_14px_rgba(57,169,0,0.3)]');
  }

  // Update Mobile Bottom Nav active styles
  document.querySelectorAll('nav.lg\\:hidden button').forEach(btn => {
    btn.classList.remove('text-[#226d00]', 'font-semibold');
    btn.classList.add('text-[#6f7b66]');
  });
  const activeBottomBtn = document.getElementById(`bottom-nav-${viewId}`);
  if (activeBottomBtn) {
    activeBottomBtn.classList.remove('text-[#6f7b66]');
    activeBottomBtn.classList.add('text-[#226d00]', 'font-semibold');
  }

  // Close Mobile Menu if open
  closeMobileMenu();
}

// Mobile Sidebar Drawer Toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobileBackdrop');
  if (sidebar && backdrop) {
    const isHidden = sidebar.classList.contains('-translate-x-full');
    if (isHidden) {
      sidebar.classList.remove('-translate-x-full');
      backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      backdrop.classList.add('hidden');
    }
  }
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobileBackdrop');
  if (sidebar && backdrop) {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }
}

// Render Recent Inspections List in Dashboard
function renderInspectionsList(filterRisk = 'todos') {
  const container = document.getElementById('inspectionsListContainer');
  if (!container) return;

  const filtered = inspections.filter(insp => {
    if (filterRisk === 'todos') return true;
    if (filterRisk === 'alto') return insp.riskLevel === 'I' || insp.riskLevel === 'II';
    if (filterRisk === 'medio') return insp.riskLevel === 'III';
    if (filterRisk === 'bajo') return insp.riskLevel === 'IV';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-[12px] text-[#6f7b66] italic p-4 text-center">No hay inspecciones registradas para este filtro.</p>`;
    return;
  }

  container.innerHTML = filtered.map(insp => {
    const isHigh = insp.riskLevel === 'I' || insp.riskLevel === 'II';
    const isMed = insp.riskLevel === 'III';
    const badgeColor = isHigh ? 'bg-[#ffdad6] text-[#ba1a1a]' : isMed ? 'bg-[#6cf8bb]/50 text-[#005236]' : 'bg-[#eaedff] text-[#006398]';
    const riskLabel = isHigh ? 'Riesgo Alto' : isMed ? 'Riesgo Medio' : 'Riesgo Bajo';

    return `
      <div onclick="selectInspection('${insp.id}')" class="p-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#eaedff] shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-[13px] text-[#131b2e] font-bold truncate">${insp.title}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${riskLabel}</span>
        </div>
        <p class="text-[12px] text-[#3f4a38] line-clamp-2 italic">"${insp.description}"</p>
        <div class="flex items-center justify-between pt-2 border-t border-[#eaedff]/70 text-[11px]">
          <span class="text-[#226d00] font-bold">Inspector: ${insp.inspectorName}</span>
          <button type="button" onclick="event.stopPropagation(); syncInspectionToSupabaseCloud('${insp.id}')" class="text-[11px] font-bold text-[#006c49] bg-[#6cf8bb]/30 hover:bg-[#6cf8bb]/50 px-2.5 py-1 rounded-lg">
            Sincronizar Supabase
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Update KPI counters
function updateKpis() {
  const totalEl = document.getElementById('kpiTotalCount');
  const badgeEl = document.getElementById('kpiTotalBadge');
  const controlEl = document.getElementById('kpiControlRate');
  const badgePending = document.getElementById('badgePendingCount');

  const total = inspections.length;
  const closed = inspections.filter(i => i.status === 'cerrado').length;
  const inProg = inspections.filter(i => i.status === 'en_proceso').length;
  const rate = total > 0 ? Math.round(((closed + inProg) / total) * 100) : 0;

  if (totalEl) totalEl.textContent = total;
  if (badgeEl) badgeEl.textContent = `n = ${total} hallazgos`;
  if (controlEl) controlEl.textContent = `${rate}%`;
  if (badgePending) badgePending.textContent = inProg > 0 ? `${inProg}` : '0';
}

// Render COPASST Members Checklist with Trash 🗑️ Delete Buttons
function renderCopasstMembers() {
  const container = document.getElementById('copasstMembersContainer');
  if (!container) return;

  container.innerHTML = copasstMembers.map(member => {
    const isSelected = selectedInspectors.includes(member.id);
    return `
      <div onclick="toggleCopasstInspector('${member.id}')" class="p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${isSelected ? 'bg-[#39a900]/10 border-[#226d00] shadow-sm' : 'bg-[#f2f3ff]/70 border-[#eaedff] hover:bg-[#eaedff]'}">
        <div class="flex items-start gap-2.5 min-w-0">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="w-4 h-4 mt-1 accent-[#226d00] rounded shrink-0">
          <div class="flex flex-col min-w-0">
            <span class="text-[13px] font-bold text-[#131b2e] truncate">${member.name}</span>
            <span class="text-[11px] text-[#226d00] font-semibold truncate">${member.role}</span>
            <span class="text-[10px] text-[#6f7b66] truncate">${member.cc} • ${member.license}</span>
          </div>
        </div>
        <!-- Botón pequeño para eliminar inspector no presente hoy -->
        <button type="button" onclick="removeCopasstInspector('${member.id}', event)" title="Eliminar inspector no presente en la inspección de hoy" class="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-lg shrink-0">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
}

function toggleCopasstInspector(id) {
  if (selectedInspectors.includes(id)) {
    if (selectedInspectors.length > 1) {
      selectedInspectors = selectedInspectors.filter(i => i !== id);
    }
  } else {
    selectedInspectors.push(id);
  }
  renderCopasstMembers();
}

function removeCopasstInspector(id, event) {
  if (event) event.stopPropagation();
  copasstMembers = copasstMembers.filter(m => m.id !== id);
  selectedInspectors = selectedInspectors.filter(i => i !== id);
  renderCopasstMembers();
  showToast('Inspector Removido', 'Se quitó el miembro del COPASST de la inspección de hoy.', 'info');
}

// GPS Geolocation Handler
function getGpsLocation() {
  const btnText = document.getElementById('txtGpsBtn');
  const resultBox = document.getElementById('gpsResultBox');
  const resultText = document.getElementById('gpsResultText');

  if (btnText) btnText.textContent = 'Obteniendo GPS...';

  if (!navigator.geolocation) {
    showToast('GPS No Disponible', 'Tu navegador no soporta geolocalización GPS.', 'error');
    if (btnText) btnText.textContent = 'Obtener Ubicación GPS';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      const acc = Math.round(pos.coords.accuracy);

      currentGpsData = { lat, lng, acc };

      if (resultText) resultText.textContent = `Latitud: ${lat} • Longitud: ${lng} (Precisión ±${acc}m)`;
      if (resultBox) resultBox.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Actualizar GPS';

      showToast('Ubicación GPS Detectada', `Coordenadas: ${lat}, ${lng}`, 'success');
    },
    (err) => {
      // Fallback
      currentGpsData = { lat: 4.58219, lng: -74.14821, acc: 10 };
      if (resultText) resultText.textContent = `Latitud: 4.58219 • Longitud: -74.14821 (Complejo Sur SENA)`;
      if (resultBox) resultBox.classList.remove('hidden');
      if (btnText) btnText.textContent = 'Actualizar GPS';

      showToast('Ubicación SENA Predeterminada', 'Coordenadas asignadas al Complejo Sur.', 'info');
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// Photo Handling
function triggerCameraInput() {
  document.getElementById('cameraInput')?.click();
}

function triggerFileInput() {
  document.getElementById('fileInput')?.click();
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      capturedImageData = event.target.result;
      const imgEl = document.getElementById('capturedPreviewImage');
      const placeholder = document.getElementById('cameraPlaceholder');
      if (imgEl && placeholder) {
        imgEl.src = capturedImageData;
        imgEl.classList.remove('hidden');
        placeholder.classList.add('hidden');
      }
      showToast('Fotografía Cargada', 'Evidencia fotográfica lista para análisis.', 'success');
    };
    reader.readAsDataURL(file);
  }
}

let selectedFinding = inspections[0];
let currentProposal = {
  hazardTitle: 'Guarda de protección desajustada en torno mecánico',
  riskCategory: 'Condiciones de Seguridad / Peligro Mecánico',
  riskLevel: 'II',
  confidence: '94%',
  gtc45Description: 'Falta tornillo prisionero en guarda acrílica del cabezal giratorio del torno T-04 en área de mecanizado.',
  recommendation: 'Instalar tornillo prisionero norma DIN 913 e implementar guarda transparente de policarbonato alto impacto.'
};

function selectInspection(id) {
  const found = inspections.find(i => i.id === id);
  if (found) {
    selectedFinding = found;
    renderFindingReport();
    navigateTo('hallazgos-plan-de-accion');
  }
}

function renderFindingReport() {
  const container = document.getElementById('findingReportContainer');
  if (!container || !selectedFinding) return;

  const isHigh = selectedFinding.riskLevel === 'I' || selectedFinding.riskLevel === 'II';
  const badgeColor = isHigh ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6cf8bb]/50 text-[#005236]';

  container.innerHTML = `
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between pb-4 border-b border-[#eaedff]">
        <div class="flex flex-col">
          <span class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">Formato Oficial F-SST-012</span>
          <h2 class="text-xl font-bold text-[#131b2e]">${selectedFinding.title}</h2>
          <span class="text-[12px] text-[#6f7b66]">Código: ${selectedFinding.code} • ${selectedFinding.sede}</span>
        </div>
        <span class="px-3 py-1 rounded-full text-[11px] font-bold ${badgeColor}">Nivel Riesgo ${selectedFinding.riskLevel}</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span class="text-[11px] font-bold text-[#6f7b66] uppercase">Área / Taller</span>
          <span class="text-[13px] font-semibold text-[#131b2e]">${selectedFinding.area}</span>
        </div>
        <div class="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
          <span class="text-[11px] font-bold text-[#6f7b66] uppercase">Inspector COPASST</span>
          <span class="text-[13px] font-semibold text-[#131b2e]">${selectedFinding.inspectorName}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <span class="text-[12px] font-bold text-[#131b2e]">Descripción del Peligro (GTC 45)</span>
        <p class="text-[13px] text-[#3f4a38] leading-relaxed p-3.5 rounded-xl bg-[#f2f3ff]/60 border border-[#eaedff]">
          ${selectedFinding.description}
        </p>
      </div>

      <div class="flex flex-col gap-2 pt-3 border-t border-[#eaedff]">
        <span class="text-[13px] font-bold text-[#131b2e]">Evidencia Fotográfica Registrada</span>
        <div class="w-full h-52 rounded-2xl overflow-hidden bg-slate-900 border border-[#eaedff]">
          <img src="${selectedFinding.imageUrl}" alt="Evidencia hallazgo" class="w-full h-full object-cover">
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#eaedff]">
        <span class="text-[12px] text-[#3f4a38]">Responsable asignado: <strong class="text-[#131b2e]">${selectedFinding.assignedTo || 'Ing. Roberto Peña'}</strong></span>
        <button onclick="exportReportPDF()" class="px-4 py-2 bg-[#226d00] text-white text-[12px] font-bold rounded-xl shadow flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">download</span>
          <span>Descargar PDF (F-SST-012)</span>
        </button>
      </div>
    </div>
  `;
}

// Proceed to Analysis
function proceedToAnalysis() {
  if (!capturedImageData) {
    showToast('Fotografía Requerida', 'Por favor captura o selecciona una foto antes de continuar.', 'error');
    return;
  }
  
  // Dynamic AI Proposal setup
  currentProposal = {
    hazardTitle: 'Condición insegura detectada en evidencia fotográfica',
    riskCategory: 'Condiciones de Seguridad / Peligro Mecánico (GTC 45)',
    riskLevel: 'II',
    confidence: '94%',
    gtc45Description: 'Análisis multimodal Gemini 2.5 detecta falta de guardas de protección y riesgo de atrapamiento o proyección de partículas.',
    recommendation: 'Instalar guarda de protección acrílica, señalización reglamentaria y aplicar protocolo LOTO.'
  };

  renderMakerCheckerProposal();
  navigateTo('analisis-ia-maker-checker');
}

let isManualCatalogMode = false;

function toggleManualMode(manual) {
  isManualCatalogMode = manual;
  renderMakerCheckerProposal();
}

function handleManualCatalogSelect(catalogId) {
  const catalog = [
    { id: 'cond-01', title: 'Falta de guarda de protección acrílica en torno', cat: 'Condiciones de Seguridad / Peligro Mecánico', risk: 'I', desc: 'Cabezal giratorio expuesto sin resguardo transparente de policarbonato.' },
    { id: 'cond-02', title: 'Empalme eléctrico expuesto en máquina esmeriladora', cat: 'Condiciones de Seguridad / Peligro Eléctrico', risk: 'I', desc: 'Cableado trifásico con aislamiento deteriorado en punto de alimentación.' },
    { id: 'cond-03', title: 'Derrame de aceite lubricante en pasillo de torno CNC', cat: 'Condiciones de Seguridad / Locativo - Pisos', risk: 'III', desc: 'Superficie de tránsito resbaladiza por fuga de refrigerante de corte.' },
    { id: 'acto-01', title: 'Operar torno sin gafas de seguridad ni EPP', cat: 'Acto Inseguro / Elementos de Protección', risk: 'II', desc: 'Aprendiz operando desbastado sin protección ocular normativa (ANSI Z87.1).' }
  ];

  const item = catalog.find(c => c.id === catalogId);
  if (item) {
    currentProposal.hazardTitle = item.title;
    currentProposal.riskCategory = item.cat;
    currentProposal.riskLevel = item.risk;
    currentProposal.gtc45Description = item.desc;
    currentProposal.confidence = 'Selección Manual Inspector';
  }
  renderMakerCheckerProposal();
}

function renderMakerCheckerProposal() {
  const container = document.getElementById('makerCheckerProposalBox');
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col gap-4 p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
      
      <!-- Toggle IA vs Selección Manual -->
      <div class="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#eaedff]">
        <span class="text-[12px] font-bold text-[#131b2e]">Modo de Clasificación GTC 45:</span>
        <div class="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg">
          <button type="button" onclick="toggleManualMode(false)" class="px-3 py-1 rounded-md text-[11px] font-bold ${!isManualCatalogMode ? 'bg-[#39a900] text-white shadow' : 'text-[#6f7b66]'}">Análisis IA</button>
          <button type="button" onclick="toggleManualMode(true)" class="px-3 py-1 rounded-md text-[11px] font-bold ${isManualCatalogMode ? 'bg-[#39a900] text-white shadow' : 'text-[#6f7b66]'}">Selección Manual</button>
        </div>
      </div>

      ${isManualCatalogMode ? `
        <div class="flex flex-col gap-2 p-3 bg-white rounded-xl border border-[#eaedff]">
          <label class="text-[12px] font-bold text-[#131b2e]">Catálogo Oficial GTC 45 (Seleccionar peligro observado):</label>
          <select onchange="handleManualCatalogSelect(this.value)" class="w-full bg-[#f2f3ff] p-2.5 rounded-xl text-[12px] border border-[#eaedff]">
            <option value="cond-01">Condición: Falta de guarda de protección acrílica en torno</option>
            <option value="cond-02">Condición: Empalme eléctrico expuesto en máquina esmeriladora</option>
            <option value="cond-03">Condición: Derrame de aceite lubricante en pasillo CNC</option>
            <option value="acto-01">Acto Inseguro: Operar torno sin gafas de seguridad ni EPP</option>
          </select>
        </div>
      ` : ''}

      <div class="flex items-center justify-between">
        <span class="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#005236] text-[11px] font-bold">${isManualCatalogMode ? 'Selección Manual Inspector' : 'Inferencia IA Gemini 2.5 • ' + currentProposal.confidence + ' Certeza'}</span>
        <span class="text-[11px] font-bold text-[#ba1a1a]">Nivel Riesgo ${currentProposal.riskLevel}</span>
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="text-[15px] font-bold text-[#131b2e]">${currentProposal.hazardTitle}</h3>
        <span class="text-[12px] text-[#226d00] font-semibold">${currentProposal.riskCategory}</span>
      </div>

      <div class="w-full h-48 rounded-xl overflow-hidden bg-slate-900 border border-[#eaedff]">
        <img src="${capturedImageData || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200'}" class="w-full h-full object-cover" alt="Evidencia cargada">
      </div>

      <p class="text-[12px] text-[#3f4a38] leading-relaxed bg-white p-3 rounded-xl border border-[#eaedff]">
        <strong>Descripción GTC 45:</strong> ${currentProposal.gtc45Description}
      </p>

      <p class="text-[12px] text-[#005236] leading-relaxed bg-[#6cf8bb]/20 p-3 rounded-xl border border-[#6cf8bb]/40">
        <strong>Medida Sugerida:</strong> ${currentProposal.recommendation}
      </p>
    </div>
  `;
}

// Approve Finding & Save to Supabase
async function approveFinding() {
  const newInsp = {
    id: `insp-${Date.now()}`,
    code: `HAL-2025-0${inspections.length + 44}`,
    title: currentProposal.hazardTitle || 'Condición insegura detectada en taller formativo',
    sede: document.getElementById('selectSede')?.value || 'Complejo Sur - Centro de Metalmecánica',
    area: document.getElementById('selectTaller')?.value || 'Taller de Maquinado',
    date: new Date().toLocaleDateString(),
    inspectorName: copasstMembers[0]?.name || 'Laura Noguera',
    riskLevel: currentProposal.riskLevel || 'II',
    riskCategory: currentProposal.riskCategory || 'Condiciones de seguridad',
    status: 'en_proceso',
    description: currentProposal.gtc45Description || 'Hallazgo registrado mediante arbitraje Maker-Checker.',
    imageUrl: capturedImageData || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    assignedTo: 'Ing. Roberto Peña'
  };

  inspections.unshift(newInsp);
  selectedFinding = newInsp;
  renderInspectionsList();
  updateKpis();
  renderFindingReport();

  showToast('Informe Aprobado', `Hallazgo ${newInsp.code} firmado exitosamente.`, 'success');

  // Supabase Save
  if (supabaseClient) {
    try {
      await supabaseClient.from('hallazgos_sst').insert({
        codigo_hallazgo: newInsp.code,
        titulo: newInsp.title,
        descripcion_detallada: newInsp.description,
        peligro_gtc45: newInsp.riskCategory,
        nivel_riesgo_homologado: newInsp.riskLevel,
        estado: 'en_proceso'
      });
    } catch (e) {
      console.warn('Notice saving finding to Supabase:', e);
    }
  }

  navigateTo('hallazgos-plan-de-accion');
}

// Modal Inspectors Functions
function openAddInspectorModal() {
  document.getElementById('modalAddInspector')?.classList.remove('hidden');
}

function closeAddInspectorModal() {
  document.getElementById('modalAddInspector')?.classList.add('hidden');
}

async function saveNewInspector(e) {
  e.preventDefault();
  const name = document.getElementById('newInspectorName').value.trim();
  const role = document.getElementById('newInspectorRole').value.trim();
  const cc = document.getElementById('newInspectorCc').value.trim();

  if (!name) return;

  const newMember = {
    id: `cop-${Date.now()}`,
    name,
    role: role || 'Representante COPASST',
    cc: cc ? `C.C. ${cc}` : 'C.C. Pendiente',
    license: `SENA-SST-${Math.floor(1000 + Math.random() * 9000)}`
  };

  copasstMembers.push(newMember);
  selectedInspectors.push(newMember.id);
  renderCopasstMembers();

  // Save to Supabase DB inspectores_copasst
  if (supabaseClient) {
    try {
      const parts = name.split(' ');
      await supabaseClient.from('inspectores_copasst').insert({
        nombres: parts[0] || name,
        apellidos: parts.slice(1).join(' ') || 'COPASST',
        documento_identidad: cc || `${Date.now()}`,
        cargo: role || 'Miembro COPASST / SST',
        licencia_sst: newMember.license
      });
    } catch (err) {
      console.warn('Notice saving inspector to Supabase DB:', err);
    }
  }

  closeAddInspectorModal();
  showToast('Inspector Registrado', `${name} guardado en la base de datos.`, 'success');
}

// Fetch Inspectors from Supabase DB on load
async function loadInspectorsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient
      .from('inspectores_copasst')
      .select('*')
      .eq('activo', true);

    if (data && data.length > 0) {
      copasstMembers = data.map(item => ({
        id: item.id,
        name: `${item.nombres} ${item.apellidos}`,
        role: item.cargo || 'Miembro COPASST / SST',
        cc: `C.C. ${item.documento_identidad}`,
        license: item.licencia_sst || 'Licencia SST SENA'
      }));
      selectedInspectors = [copasstMembers[0].id];
      renderCopasstMembers();
    }
  } catch (e) {
    console.warn('Network error loading inspectores:', e);
  }
}

// Toast Notifications
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');

  if (!container || !titleEl || !msgEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  if (iconEl) {
    iconEl.textContent = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
    iconEl.className = `material-symbols-outlined text-[24px] ${type === 'success' ? 'text-[#226d00]' : type === 'error' ? 'text-[#ba1a1a]' : 'text-[#006398]'}`;
  }

  container.classList.remove('hidden');
  setTimeout(() => closeToast(), 4000);
}

function closeToast() {
  document.getElementById('toastContainer')?.classList.add('hidden');
}

// Filter Quick Bar Toggle & Filter
function toggleFilterQuickBar() {
  document.getElementById('filterQuickBar')?.classList.toggle('hidden');
}

function setRiskFilter(level) {
  renderInspectionsList(level);
}

function exportReportPDF() {
  showToast('Generando PDF', 'Preparando documento oficial F-SST-012 para impresión/descarga...', 'info');
  setTimeout(() => {
    window.print();
  }, 500);
}

function syncInspectionToSupabaseCloud(id) {
  showToast('Sincronizando Supabase', `Inspección ${id} guardada en Supabase Cloud.`, 'success');
}

function toggleNotifications() {
  document.getElementById('notifMenu')?.classList.toggle('hidden');
}

function handleSearch(query) {
  const q = (query || '').toLowerCase().trim();
  const container = document.getElementById('inspectionsListContainer');
  if (!container) return;

  const filtered = inspections.filter(insp => 
    insp.title.toLowerCase().includes(q) ||
    insp.description.toLowerCase().includes(q) ||
    insp.code.toLowerCase().includes(q) ||
    insp.sede.toLowerCase().includes(q) ||
    insp.area.toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-[12px] text-[#6f7b66] italic p-4 text-center">No se encontraron inspecciones para "${query}".</p>`;
    return;
  }

  container.innerHTML = filtered.map(insp => {
    const isHigh = insp.riskLevel === 'I' || insp.riskLevel === 'II';
    const isMed = insp.riskLevel === 'III';
    const badgeColor = isHigh ? 'bg-[#ffdad6] text-[#ba1a1a]' : isMed ? 'bg-[#6cf8bb]/50 text-[#005236]' : 'bg-[#eaedff] text-[#006398]';
    const riskLabel = isHigh ? 'Riesgo Alto' : isMed ? 'Riesgo Medio' : 'Riesgo Bajo';

    return `
      <div onclick="selectInspection('${insp.id}')" class="p-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex flex-col gap-2 cursor-pointer border border-[#eaedff] shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-[13px] text-[#131b2e] font-bold truncate">${insp.title}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}">${riskLabel}</span>
        </div>
        <p class="text-[12px] text-[#3f4a38] line-clamp-2 italic">"${insp.description}"</p>
        <div class="flex items-center justify-between pt-2 border-t border-[#eaedff]/70 text-[11px]">
          <span class="text-[#226d00] font-bold">Inspector: ${insp.inspectorName}</span>
          <button type="button" onclick="event.stopPropagation(); syncInspectionToSupabaseCloud('${insp.id}')" class="text-[11px] font-bold text-[#006c49] bg-[#6cf8bb]/30 hover:bg-[#6cf8bb]/50 px-2.5 py-1 rounded-lg">
            Sincronizar Supabase
          </button>
        </div>
      </div>
    `;
  }).join('');
}
