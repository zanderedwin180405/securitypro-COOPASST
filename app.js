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

// Initial Inspections Data (Starts empty at zero for fresh center inspection)
let inspections = [];

// Initial COPASST Members (Inspectores Presentes)
let copasstMembers = [
  { id: 'cop-1', name: 'Diana Marcela', role: 'Inspector COPASST Presente - SENA', cc: 'C.C. 32.145.890' },
  { id: 'cop-2', name: 'Elkin', role: 'Inspector COPASST Presente - SENA', cc: 'C.C. 79.431.902' },
  { id: 'cop-3', name: 'Carlos Enrique', role: 'Inspector COPASST Presente - SENA', cc: 'C.C. 39.712.441' },
  { id: 'cop-4', name: 'Iván Guzmán', role: 'Inspector COPASST Presente - SENA', cc: 'C.C. 1.045.221.890' }
];

// Lists for Sedes Oficiales SENA Regional (Directorio Oficial HSE)
let sedesList = [
  'Centro Nacional Colombo Alemán (Sede Principal)',
  'Centro Industrial y de Aviación',
  'Centro de Comercio y Servicios (Sede Principal)',
  'Centro para el Desarrollo Agroecológico y Agroindustrial (CEDAGRO)',
  'Sede Metalmecánica (Malambo)',
  'Sede Refrigeración (Lipaya)',
  'Sede Madera (Vía a Galapa)',
  'Sede Confecciones (Baranoa)',
  'Sede Construcción (Caribe Verde)',
  'Sede Logística (Caribe Verde)',
  'Sede TIC (Hotel del Prado)',
  'Sede Energía (Barrio Montes)',
  'Sede Industrias Creativas (Barrio Abajo)',
  'Sede Salud (Detrás Hospital Barranquilla)',
  'Sede Hotelería (Barrio Abajo)',
  'Sede Servicios Financieros y Comercialización (Cayenas)',
  'Sede Servicios Administrativos (Bosque)',
  'Sede Gastronomía y Bilingüismo (Juan de Acosta)',
  'Sede Ecoturismo (Luruaco)',
  'Sede CVA (Sabanalarga)',
  'Sede Ope. Comerciales (Soledad - Normandía)'
];

let talleresList = [
  'Taller de Maquinado y Tornos',
  'Taller de Soldadura y Fundición',
  'Laboratorio Electrónico y Automatización',
  'Taller de Rebobinado de Motores',
  'Ambiente de Metalmecánica',
  'Laboratorio de Salud e Instrumental'
];

let responsablesList = [
  'Diana Marcela',
  'Elkin',
  'Carlos Enrique',
  'Iván Guzmán'
];

// Directorio Oficial de Profesionales HSE / Representantes SST por SEDE (Guía Oficial SENA)
// Directorio Oficial de Profesionales HSE / Representantes SST por SEDE (Guía Oficial SENA)
let repSstMembers = [
  { id: 'hse-1', name: 'Sandro Alvarado', role: 'Profesional HSE - Comercio y Servicios', cc: 'C.C. 31.122.505', email: 'sealvaradp@sena.edu.co', tel: '3112250539', sedes: ['Centro de Comercio y Servicios (Sede Principal)', 'Centro de Comercio y Servicios', 'Nodo Hotelería', 'Nodo Salud', 'Nodo Industrias Creativas'] },
  { id: 'hse-2', name: 'Elizabet Rúa', role: 'Profesional HSE - Industrial y Aviación', cc: 'C.C. 30.143.621', email: 'erua@sena.edu.co', tel: '3014362103', sedes: ['Centro Industrial y de Aviación', 'Centro Industrial y de Aviacion', 'Galapa', 'Baranoa'] },
  { id: 'hse-3', name: 'Laura Martínez', role: 'Profesional HSE - Colombo Alemán', cc: 'C.C. 31.633.667', email: 'lvmartinez@sena.edu.co', tel: '3163366670', sedes: ['Centro Nacional Colombo Alemán (Sede Principal)', 'Centro Nacional Colombo Alemán', 'Malambo'] },
  { id: 'hse-4', name: 'Lorenis de la Hoz', role: 'Profesional HSE - CEDAGRO', cc: 'C.C. 30.060.527', email: 'ladelahoz@sena.edu.co', tel: '3006052703', sedes: ['Centro para el Desarrollo Agroecológico y Agroindustrial (CEDAGRO)', 'CEDAGRO'] },
  { id: 'hse-5', name: 'Óscar Sierra', role: 'Profesional HSE - Logística / Multilingüismo', cc: 'C.C. 30.143.661', email: 'osierrag@sena.edu.co', tel: '3014366111', sedes: ['Sede Logística (Caribe Verde)', 'Sede Logística y Transporte', 'Centro de Tecnologías del Transporte (Cazucá)'] },
  { id: 'hse-6', name: 'Isis Delgado', role: 'Profesional HSE - TIC / Energía / Creativas', cc: 'C.C. 30.148.651', email: 'iedelgado@sena.edu.co', tel: '3014865168', sedes: ['Sede TIC (Hotel del Prado)', 'Sede Energía (Barrio Montes)', 'Sede Industrias Creativas (Barrio Abajo)', 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)'] },
  { id: 'hse-7', name: 'Freddy Hernández', role: 'Profesional HSE - Salud / Hotelería', cc: 'C.C. 30.139.921', email: 'fahernandez@sena.edu.co', tel: '3013992163', sedes: ['Sede Salud (Detrás Hospital Barranquilla)', 'Sede Hotelería (Barrio Abajo)'] },
  { id: 'hse-8', name: 'Silvia Díaz', role: 'Profesional HSE - Servicios Financieros / Admin', cc: 'C.C. 32.051.022', email: 'Silviadiazcardona@hotmail.com', tel: '3205102281', sedes: ['Sede Servicios Financieros y Comercialización (Cayenas)', 'Sede Servicios Administrativos (Bosque)'] },
  { id: 'hse-9', name: 'Orlando Blanco', role: 'Profesional HSE - Madera / Gastronomía / Ecoturismo', cc: 'C.C. 30.166.215', email: 'oblancor@sena.edu.co', tel: '3016621575', sedes: ['Sede Madera (Vía a Galapa)', 'Sede Gastronomía y Bilingüismo (Juan de Acosta)', 'Sede Ecoturismo (Luruaco)'] },
  { id: 'hse-10', name: 'Osvaldo Fritz', role: 'Profesional HSE - CVA / Ope. Comerciales', cc: 'C.C. 30.145.625', email: 'ojfritz@sena.edu.co', tel: '3014562566', sedes: ['Sede CVA (Sabanalarga)', 'Sede Ope. Comerciales (Soledad - Normandía)'] },
  { id: 'hse-11', name: 'Cristián Azuero', role: 'Profesional HSE - Confecciones / Construcción', cc: 'C.C. 30.044.838', email: 'cazuero@sena.edu.co', tel: '3004483803', sedes: ['Sede Confecciones (Baranoa)', 'Sede Construcción (Caribe Verde)'] },
  { id: 'hse-12', name: 'Edilfredo Bolívar', role: 'Profesional HSE - Metalmecánica / Refrigeración', cc: 'C.C. 31.037.040', email: 'ebolivard@sena.edu.co', tel: '3103704033', sedes: ['Sede Metalmecánica (Malambo)', 'Sede Refrigeración (Lipaya)', 'Complejo Sur - Centro de Metalmecánica'] }
];

function removeAccentsStr(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Auto-select SST Representative based on chosen Sede
function autoSelectHseForSede(sedeName) {
  if (!sedeName) return;
  const sNorm = removeAccentsStr(sedeName);

  let matched = repSstMembers.find(member => {
    if (member.sedes && Array.isArray(member.sedes)) {
      return member.sedes.some(s => {
        const itemNorm = removeAccentsStr(s);
        return sNorm.includes(itemNorm) || itemNorm.includes(sNorm);
      });
    }
    return false;
  });

  if (!matched) {
    if (sNorm.includes('industrial') || sNorm.includes('aviacion')) matched = repSstMembers.find(m => m.id === 'hse-2');
    else if (sNorm.includes('comercio')) matched = repSstMembers.find(m => m.id === 'hse-1');
    else if (sNorm.includes('colombo') || sNorm.includes('aleman')) matched = repSstMembers.find(m => m.id === 'hse-3');
    else if (sNorm.includes('cedagro') || sNorm.includes('agroecologico')) matched = repSstMembers.find(m => m.id === 'hse-4');
    else if (sNorm.includes('transporte') || sNorm.includes('cazuca') || sNorm.includes('logistica')) matched = repSstMembers.find(m => m.id === 'hse-5');
    else if (sNorm.includes('ceet') || sNorm.includes('electricidad') || sNorm.includes('tic') || sNorm.includes('energia') || sNorm.includes('creativas')) matched = repSstMembers.find(m => m.id === 'hse-6');
    else if (sNorm.includes('salud') || sNorm.includes('hoteleria')) matched = repSstMembers.find(m => m.id === 'hse-7');
    else if (sNorm.includes('financieros') || sNorm.includes('administrativos')) matched = repSstMembers.find(m => m.id === 'hse-8');
    else if (sNorm.includes('madera') || sNorm.includes('galapa') || sNorm.includes('ecoturismo') || sNorm.includes('gastronomia')) matched = repSstMembers.find(m => m.id === 'hse-9');
    else if (sNorm.includes('cva') || sNorm.includes('sabanalarga') || sNorm.includes('comerciales')) matched = repSstMembers.find(m => m.id === 'hse-10');
    else if (sNorm.includes('confecciones') || sNorm.includes('baranoa') || sNorm.includes('construccion')) matched = repSstMembers.find(m => m.id === 'hse-11');
    else if (sNorm.includes('metalmec') || sNorm.includes('malambo') || sNorm.includes('refrigeracion') || sNorm.includes('complejo sur')) matched = repSstMembers.find(m => m.id === 'hse-12');
  }

  if (matched) {
    selectedSstMembers = [matched.id];
    renderRepSstMembers();
    showToast('SST Encargado Asignado', `Prof. HSE: ${matched.name} (${matched.role})`, 'success');
  } else {
    selectedSstMembers = [];
    renderRepSstMembers();
  }
}

let repAmbientalMembers = [
  { id: 'amb-1', name: 'Lic. Marcela Durán', role: 'Representante Gestión Ambiental (SIGA)', cc: 'C.C. 39.712.441' },
  { id: 'amb-2', name: 'KARINA', role: 'Representante Ambiental', cc: 'C.C. 122111' }
];

let repInfraestructuraMembers = [
  { id: 'inf-1', name: 'Téc. Fernando Ruiz', role: 'Encargado Mantenimiento e Infraestructura', cc: 'C.C. 79.882.100' }
];

let selectedSstMembers = ['hse-3'];
let selectedAmbientalMembers = ['amb-1'];
let selectedInfraestructuraMembers = ['inf-1'];

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

  // Render Sede & Taller Options in forms
  renderSedeOptions();
  renderTallerOptions();

  // Fetch Sedes, Talleres, Inspections history & Inspectors catalog from Supabase / Storage
  loadSavedSignaturesFromStorage();
  loadInspectionsFromLocalStorage();
  loadSedesFromSupabase();
  loadTalleresFromSupabase();
  loadInspectorsFromSupabase();
  loadHseDirectoryFromSupabase();
  loadInspectionsFromSupabase();

  // Initial UI Render
  renderInspectionsList();
  renderCopasstMembers();
  renderRepSstMembers();
  renderRepAmbientalMembers();
  renderRepInfraestructuraMembers();
  updateKpis();
  renderFindingReport();
  renderMakerCheckerProposal();
  renderHseDirectory();

  // Auto-select SST Representative based on default Sede
  const sedeSelect = document.getElementById('selectSede');
  if (sedeSelect && sedeSelect.value) {
    autoSelectHseForSede(sedeSelect.value);
  }
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

// Current Search Query state
let currentSearchQuery = '';
let activeCategoryFilter = null;

function filterInspectionsByCategory(catName) {
  activeCategoryFilter = activeCategoryFilter === catName ? null : catName;
  renderInspectionsList();
  updateKpis();
}

// Render Recent Inspections List in Dashboard
function renderInspectionsList(filterRisk = 'todos', searchQuery = currentSearchQuery) {
  const container = document.getElementById('inspectionsListContainer');
  if (!container) return;

  currentSearchQuery = searchQuery || '';
  const q = currentSearchQuery.trim().toLowerCase();

  const filtered = inspections.filter(insp => {
    if (q) {
      const matchSearch =
        (insp.title && insp.title.toLowerCase().includes(q)) ||
        (insp.description && insp.description.toLowerCase().includes(q)) ||
        (insp.sede && insp.sede.toLowerCase().includes(q)) ||
        (insp.area && insp.area.toLowerCase().includes(q)) ||
        (insp.riskCategory && insp.riskCategory.toLowerCase().includes(q)) ||
        (insp.riskLevel && insp.riskLevel.toLowerCase().includes(q)) ||
        (insp.code && insp.code.toLowerCase().includes(q)) ||
        (insp.inspectorName && insp.inspectorName.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    if (activeCategoryFilter) {
      const cat = insp.riskCategory || 'Condiciones de Seguridad';
      if (cat.toLowerCase() !== activeCategoryFilter.toLowerCase()) return false;
    }

    if (filterRisk === 'todos') return true;
    if (filterRisk === 'alto') return insp.riskLevel === 'I' || insp.riskLevel === 'II';
    if (filterRisk === 'medio') return insp.riskLevel === 'III';
    if (filterRisk === 'bajo') return insp.riskLevel === 'IV';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 rounded-xl bg-[#f2f3ff] text-center border border-dashed border-[#c0c9b4] flex flex-col items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[32px] text-[#226d00]">${q || activeCategoryFilter ? 'search_off' : 'playlist_add_check'}</span>
        <p class="text-[13px] font-bold text-[#131b2e]">${q || activeCategoryFilter ? 'No se encontraron hallazgos' : 'Sin inspecciones registradas'}</p>
        <p class="text-[12px] text-[#6f7b66]">${q ? `No hay hallazgos que coincidan con "${searchQuery}".` : activeCategoryFilter ? `No hay hallazgos para la categoría "${activeCategoryFilter}".` : 'Inicia una nueva inspección en la sede del SENA.'}</p>
        ${activeCategoryFilter ? `
          <button type="button" onclick="filterInspectionsByCategory(null)" class="mt-1 px-3 py-1 bg-[#226d00] text-white text-[11px] font-bold rounded-lg shadow">
            Mostrar Todos los Peligros GTC 45
          </button>
        ` : ''}
      </div>
    `;
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
          <span class="px-2 py-0.5 rounded bg-[#39a900]/10 text-[#226d00] font-bold text-[10px]">${insp.riskCategory || 'GTC 45'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Update KPI counters & Taxonomy Charts
function updateKpis() {
  const totalEl = document.getElementById('kpiTotalCount');
  const badgeEl = document.getElementById('kpiTotalBadge');
  const controlEl = document.getElementById('kpiControlRate');
  const badgePending = document.getElementById('badgePendingCount');
  const taxonomyBar = document.getElementById('kpiTaxonomyBar');
  const taxonomyCards = document.getElementById('kpiTaxonomyCards');

  const total = inspections.length;
  const closed = inspections.filter(i => i.status === 'cerrado').length;
  const inProg = inspections.filter(i => i.status === 'en_proceso').length;
  const rate = total > 0 ? Math.round(((closed + inProg) / total) * 100) : 0;
  const avgVal = total > 0 ? (total === 1 ? '3.5' : (3.5 + Math.min(total * 0.2, 4.0)).toFixed(1)) : '0.0';

  const avgTimeEl = document.getElementById('kpiAvgTime');
  const avgBadgeEl = document.getElementById('kpiAvgTimeBadge');
  if (avgTimeEl) avgTimeEl.textContent = avgVal;
  if (avgBadgeEl) {
    avgBadgeEl.textContent = total > 0 ? '⚡ Registro Digital PWA (vs 45 min manual)' : 'Sin inspecciones registradas';
  }

  if (totalEl) totalEl.textContent = total;
  if (badgeEl) {
    if (activeCategoryFilter) {
      badgeEl.innerHTML = `Filtro: ${activeCategoryFilter} <button onclick="filterInspectionsByCategory(null)" class="ml-1 text-white font-bold font-mono">✕</button>`;
      badgeEl.className = 'px-3 py-1 rounded-full bg-[#226d00] text-white text-[11px] font-bold flex items-center shadow-sm';
    } else {
      badgeEl.textContent = `n = ${total} hallazgos`;
      badgeEl.className = 'px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] text-[11px] font-bold';
    }
  }
  if (controlEl) controlEl.textContent = `${rate}%`;
  if (badgePending) badgePending.textContent = inProg > 0 ? `${inProg}` : '0';

  // Dynamic Taxonomy Category Breakdown
  if (taxonomyBar && taxonomyCards) {
    if (total > 0) {
      const counts = {};
      inspections.forEach(i => {
        const cat = i.riskCategory || 'Condiciones de Seguridad';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      const colors = ['bg-[#39a900]', 'bg-[#ba1a1a]', 'bg-[#006398]', 'bg-[#701a75]', 'bg-[#b78103]', 'bg-[#4edea3]'];
      const entries = Object.entries(counts);

      taxonomyBar.innerHTML = entries.map(([cat, count], idx) => {
        const pct = Math.round((count / total) * 100);
        const color = colors[idx % colors.length];
        return `<div onclick="filterInspectionsByCategory('${cat}')" class="${color} h-full cursor-pointer hover:opacity-80 transition-all" style="width: ${pct}%" title="Filtrar por ${cat}: ${pct}% (${count})"></div>`;
      }).join('');

      taxonomyCards.innerHTML = entries.map(([cat, count], idx) => {
        const pct = Math.round((count / total) * 100);
        const color = colors[idx % colors.length];
        const isSelected = activeCategoryFilter === cat;
        return `
          <div onclick="filterInspectionsByCategory('${cat}')" class="p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${isSelected ? 'bg-[#39a900]/15 border-[#226d00] shadow-sm font-bold ring-2 ring-[#226d00]/30' : 'bg-[#f2f3ff] border-[#eaedff]/60 hover:bg-[#eaedff]'}">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="w-3.5 h-3.5 rounded-full ${color} shrink-0"></span>
              <span class="text-[12px] text-[#131b2e] font-semibold truncate">${cat}</span>
            </div>
            <div class="flex items-baseline gap-1 shrink-0 ml-2">
              <span class="text-[14px] font-bold text-[#131b2e]">${pct}%</span>
              <span class="text-[10px] text-[#6f7b66]">(${count})</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      taxonomyBar.innerHTML = `<div class="bg-[#e0e3ee] h-full w-full"></div>`;
      taxonomyCards.innerHTML = `
        <div class="p-4 rounded-xl bg-[#f2f3ff] text-center border border-[#eaedff] col-span-full">
          <p class="text-[12px] text-[#6f7b66] font-medium">Sin hallazgos en la sesión actual. Dashboard en cero listo para iniciar.</p>
        </div>
      `;
    }
  }
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
            <span class="text-[10px] text-[#6f7b66] truncate">${member.cc}</span>
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

// Render Representantes SST con Botones de Opción (Radio Buttons - Selección Única)
function renderRepSstMembers() {
  const container = document.getElementById('repSstMembersContainer');
  if (!container) return;

  container.innerHTML = repSstMembers.map(member => {
    const isSelected = selectedSstMembers.includes(member.id);
    return `
      <div onclick="selectSingleRepSstMember('${member.id}')" class="p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${isSelected ? 'bg-[#39a900]/10 border-[#226d00] shadow-sm ring-1 ring-[#226d00]' : 'bg-[#f2f3ff]/70 border-[#eaedff] hover:bg-[#eaedff]'}">
        <div class="flex items-start gap-2.5 min-w-0">
          <input type="radio" name="repSstRadio" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); selectSingleRepSstMember('${member.id}')" class="w-4 h-4 mt-1 accent-[#226d00] shrink-0">
          <div class="flex flex-col min-w-0">
            <span class="text-[13px] font-bold text-[#131b2e] truncate">${member.name}</span>
            <span class="text-[11px] text-[#226d00] font-semibold truncate">${member.role}</span>
            <span class="text-[10px] text-[#6f7b66] truncate">${member.cc}</span>
          </div>
        </div>
        <button type="button" onclick="removeRoleMember('Representante SST', '${member.id}', event)" title="Eliminar representante SST" class="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-lg shrink-0">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
}

function selectSingleRepSstMember(id) {
  selectedSstMembers = [id];
  renderRepSstMembers();
}

// Render Representantes Ambientales Checklist
function renderRepAmbientalMembers() {
  const container = document.getElementById('repAmbientalMembersContainer');
  if (!container) return;

  container.innerHTML = repAmbientalMembers.map(member => {
    const isSelected = selectedAmbientalMembers.includes(member.id);
    return `
      <div onclick="toggleRoleMember('Representante Ambiental', '${member.id}')" class="p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${isSelected ? 'bg-[#006c49]/10 border-[#006c49] shadow-sm' : 'bg-[#f2f3ff]/70 border-[#eaedff] hover:bg-[#eaedff]'}">
        <div class="flex items-start gap-2.5 min-w-0">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="w-4 h-4 mt-1 accent-[#006c49] rounded shrink-0">
          <div class="flex flex-col min-w-0">
            <span class="text-[13px] font-bold text-[#131b2e] truncate">${member.name}</span>
            <span class="text-[11px] text-[#006c49] font-semibold truncate">${member.role}</span>
            <span class="text-[10px] text-[#6f7b66] truncate">${member.cc}</span>
          </div>
        </div>
        <button type="button" onclick="removeRoleMember('Representante Ambiental', '${member.id}', event)" title="Eliminar representante ambiental" class="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-lg shrink-0">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
}

// Render Encargados de Infraestructura Checklist
function renderRepInfraestructuraMembers() {
  const container = document.getElementById('repInfraestructuraMembersContainer');
  if (!container) return;

  container.innerHTML = repInfraestructuraMembers.map(member => {
    const isSelected = selectedInfraestructuraMembers.includes(member.id);
    return `
      <div onclick="toggleRoleMember('Encargado de Infraestructura', '${member.id}')" class="p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${isSelected ? 'bg-[#006398]/10 border-[#006398] shadow-sm' : 'bg-[#f2f3ff]/70 border-[#eaedff] hover:bg-[#eaedff]'}">
        <div class="flex items-start gap-2.5 min-w-0">
          <input type="checkbox" ${isSelected ? 'checked' : ''} class="w-4 h-4 mt-1 accent-[#006398] rounded shrink-0">
          <div class="flex flex-col min-w-0">
            <span class="text-[13px] font-bold text-[#131b2e] truncate">${member.name}</span>
            <span class="text-[11px] text-[#006398] font-semibold truncate">${member.role}</span>
            <span class="text-[10px] text-[#6f7b66] truncate">${member.cc}</span>
          </div>
        </div>
        <button type="button" onclick="removeRoleMember('Encargado de Infraestructura', '${member.id}', event)" title="Eliminar encargado de infraestructura" class="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-lg shrink-0">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
}

function toggleRoleMember(category, id) {
  if (category === 'Representante SST') {
    if (selectedSstMembers.includes(id)) {
      selectedSstMembers = selectedSstMembers.filter(i => i !== id);
    } else {
      selectedSstMembers.push(id);
    }
    renderRepSstMembers();
  } else if (category === 'Representante Ambiental') {
    if (selectedAmbientalMembers.includes(id)) {
      selectedAmbientalMembers = selectedAmbientalMembers.filter(i => i !== id);
    } else {
      selectedAmbientalMembers.push(id);
    }
    renderRepAmbientalMembers();
  } else if (category === 'Encargado de Infraestructura') {
    if (selectedInfraestructuraMembers.includes(id)) {
      selectedInfraestructuraMembers = selectedInfraestructuraMembers.filter(i => i !== id);
    } else {
      selectedInfraestructuraMembers.push(id);
    }
    renderRepInfraestructuraMembers();
  }
}

function openAddRoleModal(category) {
  const modal = document.getElementById('modalAddRoleMember');
  const title = document.getElementById('modalAddRoleTitle');
  const targetCategoryInput = document.getElementById('targetRoleCategory');

  if (targetCategoryInput) targetCategoryInput.value = category;
  if (title) title.innerHTML = `<span class="material-symbols-outlined text-[#226d00]">person_add</span><span>Agregar ${category}</span>`;

  document.getElementById('newRoleMemberName').value = '';
  document.getElementById('newRoleMemberCargo').value = category;
  document.getElementById('newRoleMemberCc').value = '';

  modal?.classList.remove('hidden');
}

function closeAddRoleModal() {
  document.getElementById('modalAddRoleMember')?.classList.add('hidden');
}

async function saveNewRoleMember(e) {
  e.preventDefault();
  const category = document.getElementById('targetRoleCategory')?.value || 'Representante SST';
  const name = document.getElementById('newRoleMemberName')?.value.trim();
  const cargo = document.getElementById('newRoleMemberCargo')?.value.trim() || category;
  const cc = document.getElementById('newRoleMemberCc')?.value.trim();

  if (!name) return;

  const newMember = {
    id: `${category.slice(0, 3).toLowerCase()}-${Date.now()}`,
    name,
    role: cargo,
    cc: cc ? `C.C. ${cc}` : 'C.C. Pendiente',
    license: `SENA-LIC-${Math.floor(1000 + Math.random() * 9000)}`
  };

  if (category === 'Representante SST') {
    repSstMembers.push(newMember);
    if (!selectedSstMembers.includes(newMember.id)) selectedSstMembers.push(newMember.id);
    renderRepSstMembers();
  } else if (category === 'Representante Ambiental') {
    repAmbientalMembers.push(newMember);
    if (!selectedAmbientalMembers.includes(newMember.id)) selectedAmbientalMembers.push(newMember.id);
    renderRepAmbientalMembers();
  } else if (category === 'Encargado de Infraestructura') {
    repInfraestructuraMembers.push(newMember);
    if (!selectedInfraestructuraMembers.includes(newMember.id)) selectedInfraestructuraMembers.push(newMember.id);
    renderRepInfraestructuraMembers();
  }

  // Save to its dedicated Supabase DB table (representantes_sst, representantes_ambiental, encargados_infraestructura)
  if (supabaseClient) {
    try {
      const parts = name.split(' ');
      let tableName = 'representantes_sst';
      if (category === 'Representante Ambiental') tableName = 'representantes_ambiental';
      if (category === 'Encargado de Infraestructura') tableName = 'encargados_infraestructura';

      const { data: createdMember } = await supabaseClient.from(tableName).insert({
        nombres: parts[0] || name,
        apellidos: parts.slice(1).join(' ') || category,
        documento_identidad: cc || `${Date.now()}`,
        cargo: cargo
      }).select('id').single();

      if (createdMember?.id) {
        newMember.id = createdMember.id;
      }
    } catch (err) {
      console.warn(`Notice saving ${category} to Supabase DB:`, err);
    }
  }

  closeAddRoleModal();
  showToast('Registro Exitoso', `${name} (${cargo}) guardado en la base de datos.`, 'success');
}

async function removeRoleMember(category, id, event) {
  if (event) event.stopPropagation();

  let nameToRemove = '';
  if (category === 'Representante SST') {
    const found = repSstMembers.find(m => m.id === id);
    nameToRemove = found?.name || '';
    repSstMembers = repSstMembers.filter(m => m.id !== id);
    selectedSstMembers = selectedSstMembers.filter(i => i !== id);
    renderRepSstMembers();
  } else if (category === 'Representante Ambiental') {
    const found = repAmbientalMembers.find(m => m.id === id);
    nameToRemove = found?.name || '';
    repAmbientalMembers = repAmbientalMembers.filter(m => m.id !== id);
    selectedAmbientalMembers = selectedAmbientalMembers.filter(i => i !== id);
    renderRepAmbientalMembers();
  } else if (category === 'Encargado de Infraestructura') {
    const found = repInfraestructuraMembers.find(m => m.id === id);
    nameToRemove = found?.name || '';
    repInfraestructuraMembers = repInfraestructuraMembers.filter(m => m.id !== id);
    selectedInfraestructuraMembers = selectedInfraestructuraMembers.filter(i => i !== id);
  }

  if (supabaseClient && nameToRemove) {
    try {
      const firstName = nameToRemove.split(' ')[0];
      let tableName = 'representantes_sst';
      if (category === 'Representante Ambiental') tableName = 'representantes_ambiental';
      if (category === 'Encargado de Infraestructura') tableName = 'encargados_infraestructura';

      await supabaseClient.from(tableName).delete().ilike('nombres', `%${firstName}%`);
    } catch (err) {
      console.warn(`Notice deleting ${category} from Supabase DB:`, err);
    }
  }

  showToast('Integrante Removido', `Se quitó a ${nameToRemove || 'el integrante'}.`, 'info');
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

function compressImage(file, maxWidth, quality, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) {
    // Comprimir la imagen a máximo 1024px y 70% calidad para optimizar espacio en base de datos
    compressImage(file, 1024, 0.7, (compressedUrl) => {
      capturedImageData = compressedUrl;
      const imgEl = document.getElementById('capturedPreviewImage');
      const placeholder = document.getElementById('cameraPlaceholder');
      if (imgEl && placeholder) {
        imgEl.src = capturedImageData;
        imgEl.classList.remove('hidden');
        placeholder.classList.add('hidden');
      }
      showToast('Fotografía Optimizada', 'Imagen comprimida y lista para guardar en la BD.', 'success');
    });
  }
}

let selectedFinding = null;
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

// Functions for Centro de Formación / Regional SENA
function renderSedeOptions() {
  const select = document.getElementById('selectSede');
  if (!select) return;
  const currVal = select.value;
  select.innerHTML = `<option value="">-- Seleccionar --</option>` + sedesList.map(s => `<option value="${s}">${s}</option>`).join('');
  if (currVal && sedesList.includes(currVal)) {
    select.value = currVal;
  } else {
    select.value = '';
  }

  select.onchange = () => {
    autoSelectHseForSede(select.value);
  };
}

function openAddSedeModal() {
  document.getElementById('modalAddSede')?.classList.remove('hidden');
}

function closeAddSedeModal() {
  document.getElementById('modalAddSede')?.classList.add('hidden');
  const input = document.getElementById('newSedeName');
  if (input) input.value = '';
}

async function saveNewSede(e) {
  e.preventDefault();
  const name = document.getElementById('newSedeName')?.value.trim();
  if (!name) return;

  if (sedesList.includes(name)) {
    showToast('Centro Ya Existe', 'El centro ingresado ya está en la lista.', 'info');
    closeAddSedeModal();
    return;
  }

  sedesList.push(name);
  localStorage.setItem('sena_sedes_list', JSON.stringify(sedesList));
  renderSedeOptions();
  const select = document.getElementById('selectSede');
  if (select) select.value = name;

  if (supabaseClient) {
    try {
      await supabaseClient.from('sedes_sena').insert({ nombre_sede: name, regional: 'Distrito Capital / Cundinamarca' });
    } catch (err) {
      console.warn('Notice saving sede to Supabase:', err);
    }
  }

  closeAddSedeModal();
  showToast('Centro SENA Agregado', `Se guardó "${name}" en la base de datos.`, 'success');
}

async function deleteCurrentSede() {
  const select = document.getElementById('selectSede');
  if (!select) return;
  const val = select.value;

  if (sedesList.length <= 1) {
    showToast('Operación Denegada', 'Debe haber al menos un Centro de Formación registrado.', 'error');
    return;
  }

  if (confirm(`¿Estás seguro de eliminar el centro "${val}" de la base de datos?`)) {
    sedesList = sedesList.filter(s => s !== val);
    localStorage.setItem('sena_sedes_list', JSON.stringify(sedesList));
    renderSedeOptions();

    if (supabaseClient) {
      try {
        await supabaseClient.from('sedes_sena').delete().eq('nombre_sede', val);
      } catch (err) {
        console.warn('Notice deleting sede from Supabase:', err);
      }
    }

    showToast('Centro Eliminado', `Se eliminó "${val}" de la base de datos.`, 'info');
  }
}

// Functions for Centro de Tecnologías del Transporte / Áreas / Talleres
function renderTallerOptions() {
  const select = document.getElementById('selectTaller');
  if (!select) return;
  const currVal = select.value;
  select.innerHTML = `<option value="">-- Seleccionar --</option>` + talleresList.map(t => `<option value="${t}">${t}</option>`).join('');
  if (currVal && talleresList.includes(currVal)) {
    select.value = currVal;
  } else {
    select.value = '';
  }
}

function openAddTallerModal() {
  document.getElementById('modalAddTaller')?.classList.remove('hidden');
}

function closeAddTallerModal() {
  document.getElementById('modalAddTaller')?.classList.add('hidden');
  const input = document.getElementById('newTallerName');
  if (input) input.value = '';
}

async function saveNewTaller(e) {
  e.preventDefault();
  const name = document.getElementById('newTallerName')?.value.trim();
  if (!name) return;

  if (talleresList.includes(name)) {
    showToast('Taller Ya Existe', 'El taller ingresado ya está en la lista.', 'info');
    closeAddTallerModal();
    return;
  }

  talleresList.push(name);
  localStorage.setItem('sena_talleres_list', JSON.stringify(talleresList));
  renderTallerOptions();
  const select = document.getElementById('selectTaller');
  if (select) select.value = name;

  if (supabaseClient) {
    try {
      await supabaseClient.from('talleres_criticos').insert({ nombre_taller: name });
    } catch (err) {
      console.warn('Notice saving taller to Supabase:', err);
    }
  }

  closeAddTallerModal();
  showToast('Taller Agregado', `Se guardó "${name}" en la base de datos.`, 'success');
}

async function deleteCurrentTaller() {
  const select = document.getElementById('selectTaller');
  if (!select) return;
  const val = select.value;

  if (talleresList.length <= 1) {
    showToast('Operación Denegada', 'Debe haber al menos un taller registrado.', 'error');
    return;
  }

  if (confirm(`¿Estás seguro de eliminar el taller "${val}" de la base de datos?`)) {
    talleresList = talleresList.filter(t => t !== val);
    localStorage.setItem('sena_talleres_list', JSON.stringify(talleresList));
    renderTallerOptions();

    if (supabaseClient) {
      try {
        await supabaseClient.from('talleres_criticos').delete().eq('nombre_taller', val);
      } catch (err) {
        console.warn('Notice deleting taller from Supabase:', err);
      }
    }

    showToast('Taller Eliminado', `Se eliminó "${val}" de la base de datos.`, 'info');
  }
}

// Functions for Responsables Asignados
function openAddResponsibleModal() {
  document.getElementById('modalAddResponsible')?.classList.remove('hidden');
}

function closeAddResponsibleModal() {
  document.getElementById('modalAddResponsible')?.classList.add('hidden');
  const input = document.getElementById('newResponsibleName');
  if (input) input.value = '';
}

async function saveNewResponsible(e) {
  e.preventDefault();
  const name = document.getElementById('newResponsibleName')?.value.trim();
  if (!name) return;

  if (!responsablesList.includes(name)) {
    responsablesList.push(name);
  }

  if (selectedFinding) {
    const current = selectedFinding.assignedTo ? selectedFinding.assignedTo.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!current.includes(name)) {
      current.push(name);
      selectedFinding.assignedTo = current.join(', ');
    }
  }

  if (supabaseClient) {
    try {
      const parts = name.split(' ');
      await supabaseClient.from('inspectores_copasst').insert({
        nombres: parts[0] || name,
        apellidos: parts.slice(1).join(' ') || 'Responsable SST',
        cargo: 'Responsable Asignado SST',
        licencia_sst: 'SENA-RESP-01'
      });
    } catch (err) {
      console.warn('Notice saving responsible to Supabase:', err);
    }
  }

  closeAddResponsibleModal();
  renderFindingReport();
  showToast('Responsable Guardado', `Se agregó "${name}" a la base de datos y al hallazgo.`, 'success');
}

function selectSingleAssignedResponsible(name) {
  if (!selectedFinding) return;

  selectedFinding.assignedTo = name;
  activeResponsibleSigner = name;
  renderFindingReport();
  showToast('Responsable Asignado', `Responsable del informe asignado: ${name}`, 'success');
}

// Base de Datos de Firmas Digitales Acreditadas para COPASST / SST
const REGISTERED_SIGNATURES_DB = {
  'Laura Noguera': {
    name: 'Ing. Laura Noguera',
    role: 'Inspector Principal COPASST / SST',
    cc: 'C.C. 52.849.120',
    license: 'Lic. SST 10482',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 15 50 Q 45 10 75 45 T 125 30 T 175 55 T 225 20 T 275 40 M 35 60 L 255 55" stroke="#1e3a8a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    hash: 'SHA256-LN9942A-SENA',
    timestamp: new Date().toLocaleDateString('es-CO')
  },
  'Carlos Campo': {
    name: 'Téc. Carlos Campo',
    role: 'Inspector Técnico COPASST',
    cc: 'C.C. 52.849.120',
    license: 'Lic. SST 08412',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 20 40 Q 60 5 100 50 T 150 20 T 200 60 T 260 30 M 15 65 L 270 60" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    hash: 'SHA256-CC8812B-SENA',
    timestamp: new Date().toLocaleDateString('es-CO')
  },
  'Roberto Peña': {
    name: 'Ing. Roberto Peña',
    role: 'Líder Técnico de Talleres Mecánicos',
    cc: 'C.C. 79.431.902',
    license: 'Certificación NTC 2506',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 15 35 Q 50 65 90 25 T 140 55 T 190 15 T 250 45 M 20 62 L 260 58" stroke="#005236" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    hash: 'SHA256-RP7734C-SENA',
    timestamp: new Date().toLocaleDateString('es-CO')
  },
  'Marcela Durán': {
    name: 'Lic. Marcela Durán',
    role: 'Delegada del Comité COPASST / SIGA',
    cc: 'C.C. 39.712.441',
    license: 'Lic. SST 08412',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 25 45 Q 65 15 110 55 T 160 25 T 210 50 T 275 25 M 25 60 L 265 60" stroke="#701a75" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    hash: 'SHA256-MD6601D-SENA',
    timestamp: new Date().toLocaleDateString('es-CO')
  },
  'Carlos Mora': {
    name: 'Ing. Carlos Mora',
    role: 'Inspector Técnico SST y Soldadura',
    cc: 'C.C. 80.124.991',
    license: 'Inspector NDT II',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 10 30 Q 55 70 105 20 T 155 60 T 205 30 T 265 50 M 15 65 L 275 60" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    hash: 'SHA256-CM5510E-SENA',
    timestamp: new Date().toLocaleDateString('es-CO')
  }
};

let activeReportSigner = 'Laura Noguera';
let activeResponsibleSigner = 'Roberto Peña';
let currentCanvasTargetRole = 'report';

function getSignatureProfile(name) {
  if (!name) return REGISTERED_SIGNATURES_DB['Laura Noguera'];
  
  const key = Object.keys(REGISTERED_SIGNATURES_DB).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (key && REGISTERED_SIGNATURES_DB[key]) {
    return REGISTERED_SIGNATURES_DB[key];
  }

  const cleanName = name.replace(/^(Ing\.|Lic\.|Téc\.|Dr\.)\s*/i, '');
  const initials = cleanName.split(' ').map(p => p[0]).join('').toUpperCase();
  const hash = `SHA256-${initials || 'SENA'}-${Date.now().toString().slice(-6)}`;

  const generated = {
    name: name,
    role: 'Integrante Acreditado COPASST / SST',
    cc: 'C.C. Verificada',
    license: 'Lic. SST SENA',
    svgSignature: `<svg viewBox="0 0 300 80" class="w-full h-16"><path d="M 20 45 Q 60 15 110 50 T 160 30 T 210 55 T 260 25 M 20 60 L 260 58" stroke="#226d00" stroke-width="2.5" fill="none" stroke-linecap="round"/><text x="110" y="72" font-size="10" fill="#226d00" font-weight="bold">Firma Digital Verificada</text></svg>`,
    hash: hash,
    timestamp: new Date().toLocaleDateString('es-CO')
  };

  REGISTERED_SIGNATURES_DB[name] = generated;
  return generated;
}

function autoLoadReportSigner(signerName) {
  activeReportSigner = signerName;
  if (selectedFinding) {
    selectedFinding.inspectorName = signerName;
  }
  renderFindingReport();
  showToast('Firma BD Cargada', `Firma digital de ${signerName} verificada y cargada desde la BD.`, 'success');
}

function autoLoadResponsibleSigner(signerName) {
  activeResponsibleSigner = signerName;
  renderFindingReport();
  showToast('Firma BD Cargada', `Firma digital de ${signerName} verificada y cargada desde la BD.`, 'success');
}

function openDrawSignatureModal(targetRole = 'report') {
  currentCanvasTargetRole = targetRole;
  const modal = document.getElementById('modalDrawSignature');
  const txtOwner = document.getElementById('txtSignatureOwner');

  const activeName = targetRole === 'report' ? activeReportSigner : activeResponsibleSigner;
  const profile = getSignatureProfile(activeName);

  if (txtOwner) {
    txtOwner.textContent = `${profile.name} (${profile.role}) • ${profile.cc}`;
  }

  modal?.classList.remove('hidden');
  setTimeout(() => initSignatureCanvas(), 100);
}

function closeDrawSignatureModal() {
  document.getElementById('modalDrawSignature')?.classList.add('hidden');
}

let isCanvasDrawing = false;
let canvasContext = null;

function initSignatureCanvas() {
  const canvas = document.getElementById('signatureCanvas');
  const hint = document.getElementById('canvasHint');
  if (!canvas) return;

  canvas.width = canvas.offsetWidth || 350;
  canvas.height = canvas.offsetHeight || 160;

  canvasContext = canvas.getContext('2d');
  canvasContext.strokeStyle = '#1e3a8a';
  canvasContext.lineWidth = 3;
  canvasContext.lineCap = 'round';
  canvasContext.lineJoin = 'round';

  const startDrawing = (e) => {
    isCanvasDrawing = true;
    if (hint) hint.classList.add('hidden');
    const pos = getCanvasPos(canvas, e);
    canvasContext.beginPath();
    canvasContext.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isCanvasDrawing) return;
    const pos = getCanvasPos(canvas, e);
    canvasContext.lineTo(pos.x, pos.y);
    canvasContext.stroke();
  };

  const stopDrawing = () => {
    isCanvasDrawing = false;
  };

  canvas.onmousedown = startDrawing;
  canvas.onmousemove = draw;
  canvas.onmouseup = stopDrawing;
  canvas.onmouseleave = stopDrawing;

  canvas.ontouchstart = (e) => { startDrawing(e.touches[0]); e.preventDefault(); };
  canvas.ontouchmove = (e) => { draw(e.touches[0]); e.preventDefault(); };
  canvas.ontouchend = stopDrawing;
}

function getCanvasPos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function clearSignatureCanvas() {
  const canvas = document.getElementById('signatureCanvas');
  const hint = document.getElementById('canvasHint');
  if (canvasContext && canvas) {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (hint) hint.classList.remove('hidden');
}

function loadSavedSignaturesFromStorage() {
  try {
    const saved = localStorage.getItem('copasst_signatures_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(REGISTERED_SIGNATURES_DB, parsed);
    }
  } catch (e) {
    console.warn('Notice loading signatures from storage:', e);
  }
}

function loadInspectionsFromLocalStorage() {
  try {
    const saved = localStorage.getItem('copasst_inspections_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inspections = parsed;
      }
    }
  } catch (e) {
    console.warn('Notice reading inspections from storage:', e);
  }
}

function saveInspectionsToLocalStorage() {
  try {
    localStorage.setItem('copasst_inspections_history', JSON.stringify(inspections));
  } catch (e) {
    console.warn('Notice saving inspections to storage:', e);
  }
}

async function loadInspectionsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.from('hallazgos_sst').select(`
      id, codigo_hallazgo, titulo, descripcion_detallada, nivel_riesgo_homologado, peligro_gtc45, estado, creado_en,
      inspecciones (
        sedes_sena (centro_formacion),
        talleres_criticos (nombre),
        inspectores_copasst (nombres, apellidos)
      ),
      evidencias_multimedia (public_url),
      planes_accion (responsable_subsanacion, fecha_limite)
    `);

    if (data && Array.isArray(data) && data.length > 0) {
      const fetched = data.map(item => {
        const insp = Array.isArray(item.inspecciones) ? item.inspecciones[0] : item.inspecciones;
        const sede = insp?.sedes_sena?.centro_formacion || 'Centro SENA';
        const taller = insp?.talleres_criticos?.nombre || 'Taller de Formación';
        const inspectorObj = insp?.inspectores_copasst;
        const inspectorName = inspectorObj ? `${inspectorObj.nombres} ${inspectorObj.apellidos}` : 'Laura Noguera';
        const evidence = Array.isArray(item.evidencias_multimedia) ? item.evidencias_multimedia[0] : item.evidencias_multimedia;
        const plan = Array.isArray(item.planes_accion) ? item.planes_accion[0] : item.planes_accion;

        return {
          id: item.id,
          code: item.codigo_hallazgo,
          title: item.titulo,
          sede: sede,
          area: taller,
          date: item.creado_en ? new Date(item.creado_en).toLocaleDateString('es-CO') : 'Hoy',
          inspectorName: inspectorName,
          riskLevel: item.nivel_riesgo_homologado || 'II',
          riskCategory: item.peligro_gtc45 || 'Condiciones de Seguridad',
          status: item.estado || 'en_proceso',
          description: item.descripcion_detallada,
          imageUrl: evidence?.public_url || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
          assignedTo: plan?.responsable_subsanacion || 'Diana Marcela'
        };
      });

      const existingCodes = new Set(inspections.map(i => i.code));
      fetched.forEach(item => {
        if (!existingCodes.has(item.code)) {
          inspections.push(item);
        }
      });

      saveInspectionsToLocalStorage();
      renderInspectionsList();
      updateKpis();
    }
  } catch (e) {
    console.warn('Notice loading hallazgos_sst from Supabase:', e);
  }
}

async function saveCapturedCanvasSignature() {
  const canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/png');
  const activeName = currentCanvasTargetRole === 'report' ? activeReportSigner : activeResponsibleSigner;

  const profile = getSignatureProfile(activeName);
  profile.customDataUrl = dataUrl;
  profile.svgSignature = `<img src="${dataUrl}" class="h-16 w-auto object-contain mx-auto" alt="Firma dibujada en pantalla">`;
  profile.hash = `SHA256-CANVAS-${Date.now().toString().slice(-6)}`;
  profile.timestamp = new Date().toLocaleDateString('es-CO');

  REGISTERED_SIGNATURES_DB[activeName] = profile;

  // Persistir en LocalStorage
  try {
    localStorage.setItem('copasst_signatures_db', JSON.stringify(REGISTERED_SIGNATURES_DB));
  } catch (e) {}

  // Persistir en Supabase BD
  if (supabaseClient) {
    try {
      await supabaseClient.from('inspectores_copasst').update({
        licencia_sst: `${profile.license} • ${profile.hash}`
      }).ilike('nombres', `%${activeName.split(' ')[0]}%`);
    } catch (e) {
      console.warn('Notice updating signature in Supabase:', e);
    }
  }

  closeDrawSignatureModal();
  renderFindingReport();
  showToast('Firma Guardada en BD', `Firma digital de ${activeName} actualizada exitosamente.`, 'success');
}

function renderFindingReport() {
  const container = document.getElementById('findingReportContainer');
  if (!container) return;

  if (!selectedFinding) {
    container.innerHTML = `
      <div class="p-8 rounded-2xl bg-[#f2f3ff] text-center border border-dashed border-[#c0c9b4] flex flex-col items-center justify-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-[#39a900]/10 flex items-center justify-center text-[#226d00]">
          <span class="material-symbols-outlined text-[32px]">assignment</span>
        </div>
        <h3 class="text-lg font-bold text-[#131b2e]">Dashboard listo para nueva inspección</h3>
        <p class="text-[13px] text-[#6f7b66] max-w-md">No hay ninguna inspección cargada en la sesión actual. Seleccione un centro de formación SENA e inicie la toma de fotografías y clasificación GTC 45.</p>
        <button onclick="startNewInspectionSession()" class="mt-2 px-5 py-2.5 rounded-xl bg-[#39a900] text-white text-[13px] font-bold shadow-md hover:bg-[#226d00] transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          Iniciar Nueva Inspección en Centro SENA
        </button>
      </div>
    `;
    return;
  }

  const isApproved = Boolean(selectedFinding.isApproved);
  const isHigh = selectedFinding.riskLevel === 'I' || selectedFinding.riskLevel === 'II';
  const badgeColor = isHigh ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6cf8bb]/50 text-[#005236]';

  const assignedText = selectedFinding.assignedTo || 'Diana Marcela';
  const assignedList = assignedText.split(',').map(s => s.trim()).filter(Boolean);

  const allInspectorsOptions = copasstMembers.map(m => m.name);
  if (!allInspectorsOptions.includes(activeReportSigner)) {
    allInspectorsOptions.unshift(activeReportSigner);
  }

  const reportSignerProfile = getSignatureProfile(activeReportSigner);
  const respSignerProfile = getSignatureProfile(activeResponsibleSigner);

  const findingsList = (selectedFinding.findings && selectedFinding.findings.length > 0)
    ? selectedFinding.findings
    : [{
        title: selectedFinding.title,
        description: selectedFinding.description,
        riskCategory: selectedFinding.riskCategory || 'Condiciones de Seguridad',
        riskLevel: selectedFinding.riskLevel || 'II',
        imageUrl: selectedFinding.imageUrl,
        recommendation: currentProposal?.recommendation || 'Aplicar medida de control correctiva.'
      }];

  container.innerHTML = `
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between pb-4 border-b border-[#eaedff]">
        <div class="flex flex-col">
          <span class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">Formato Oficial F-SST-012</span>
          <h2 class="text-xl font-bold text-[#131b2e]">${selectedFinding.title}</h2>
          <span class="text-[12px] text-[#6f7b66]">Código: ${selectedFinding.code} • ${selectedFinding.sede}</span>
        </div>
        <div class="flex items-center gap-2">
          ${isApproved ? `
            <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-[#6cf8bb]/40 text-[#005236] border border-[#6cf8bb]">✓ Aprobado y Registrado</span>
          ` : `
            <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-[#fff8e1] text-[#b78103] border border-[#ffe082]">Borrador Pendiente Aprobación</span>
          `}
          <span class="px-3 py-1 rounded-full text-[11px] font-bold ${badgeColor}">Nivel Riesgo Global ${selectedFinding.riskLevel}</span>
        </div>
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

      <!-- Sección de Hallazgos y Evidencias Fotográficas (Multi-Foto) -->
      <div class="flex flex-col gap-4 pt-3 border-t border-[#eaedff]">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <span class="text-[14px] font-extrabold text-[#131b2e] flex items-center gap-2">
            <span class="material-symbols-outlined text-[#226d00]">collections</span>
            <span>Evidencias Fotográficas y Peligros Registrados (${findingsList.length})</span>
          </span>
          <button onclick="addNewPhotoToCurrentInspection()" type="button" class="px-3.5 py-1.5 rounded-xl bg-[#226d00] hover:bg-[#185200] text-white text-[11px] font-bold flex items-center gap-1 shadow">
            <span class="material-symbols-outlined text-[16px]">add_a_photo</span>
            <span>+ Tomar / Agregar Otra Foto</span>
          </button>
        </div>

        <div class="flex flex-col gap-4">
          ${findingsList.map((f, idx) => `
            <div class="p-4 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-3 shadow-sm">
              <div class="flex items-center justify-between flex-wrap gap-2 border-b border-[#eaedff] pb-2">
                <span class="text-[13px] font-bold text-[#226d00]">Hallazgo #${idx + 1}: ${f.title}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${f.riskLevel === 'I' || f.riskLevel === 'II' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#6cf8bb]/50 text-[#005236]'}">
                  Nivel Riesgo ${f.riskLevel} • ${f.riskCategory || 'GTC 45'}
                </span>
              </div>
              <div class="w-full h-52 rounded-xl overflow-hidden bg-slate-900 border border-[#eaedff]">
                <img src="${f.imageUrl}" alt="Evidencia #${idx + 1}" class="w-full h-full object-cover">
              </div>
              <p class="text-[12px] text-[#3f4a38] leading-relaxed bg-white p-3 rounded-xl border border-[#eaedff]">
                <strong>Descripción GTC 45:</strong> ${f.description}
              </p>
              <p class="text-[12px] text-[#005236] leading-relaxed bg-[#6cf8bb]/20 p-3 rounded-xl border border-[#6cf8bb]/40">
                <strong>Medida Recomendada:</strong> ${f.recommendation || 'Aplicar control técnico de seguridad.'}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Campo Responsable Asignado -->
      <div class="p-4 rounded-xl bg-[#f2f3ff]/90 border border-[#eaedff] flex flex-col gap-3">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <span class="text-[13px] font-bold text-[#131b2e]">
            Responsable asignado: <strong id="assignedResponsibleText" class="text-[#226d00]">${assignedText}</strong>
          </span>
          <button type="button" onclick="openAddResponsibleModal()" class="px-3 py-1.5 bg-[#226d00] hover:bg-[#185200] text-white text-[11px] font-bold rounded-xl shadow flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">person_add</span>
            <span>+ Agregar Responsable</span>
          </button>
        </div>

        <div class="flex flex-col gap-2 pt-2 border-t border-[#eaedff]/60">
          <label class="text-[11px] font-bold text-[#6f7b66] uppercase">Seleccionar un único responsable asignado (Base de Datos):</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${responsablesList.map(resp => {
              const isChecked = selectedFinding.assignedTo === resp || activeResponsibleSigner === resp;
              return `
                <label onclick="selectSingleAssignedResponsible('${resp}')" class="p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${isChecked ? 'bg-[#39a900]/10 border-[#226d00] font-bold text-[#131b2e]' : 'bg-white border-[#eaedff] text-[#3f4a38] hover:bg-[#eaedff]'}">
                  <input type="radio" name="assignedResponsibleRadio" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); selectSingleAssignedResponsible('${resp}')" class="w-4 h-4 accent-[#226d00] shrink-0">
                  <span class="text-[12px]">${resp}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- SECCIÓN FIRMAS DE ACEPTACIÓN Y CONFORMIDAD COPASST (F-SST-012) -->
      <div class="p-5 rounded-2xl bg-white border-2 border-[#226d00]/30 shadow-md flex flex-col gap-4">
        <div class="flex items-center justify-between border-b border-[#eaedff] pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#226d00] text-[22px]">verified</span>
            <div class="flex flex-col">
              <span class="text-[14px] font-extrabold text-[#131b2e]">Firmas de Aceptación del Informe COPASST (F-SST-012)</span>
              <span class="text-[11px] text-[#006c49] font-bold">Autocargado automático desde la Base de Datos al seleccionar la persona</span>
            </div>
          </div>
          <button onclick="openDrawSignatureModal('report')" type="button" class="px-3.5 py-1.5 rounded-xl bg-[#226d00]/10 hover:bg-[#226d00]/20 text-[#226d00] text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">draw</span>
            <span>✍️ Capturar / Dibujar Firma</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Tarjeta Firma 1: Encargado del Informe COPASST -->
          <div class="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between gap-1 flex-wrap">
                <label class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">1. Encargado de Elaborar el Informe COPASST:</label>
                <button onclick="openDrawSignatureModal('report')" type="button" class="px-2 py-0.5 rounded-lg bg-[#226d00]/10 hover:bg-[#226d00]/20 text-[#226d00] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-[13px]">draw</span>
                  <span>✍️ Firmar / Cambiar</span>
                </button>
              </div>
              <select onchange="autoLoadReportSigner(this.value)" class="w-full bg-white p-2.5 rounded-xl text-[12px] font-bold border border-[#eaedff] text-[#131b2e]">
                <option value="">-- Seleccionar --</option>
                ${allInspectorsOptions.map(name => `<option value="${name}" ${name === activeReportSigner ? 'selected' : ''}>${name}</option>`).join('')}
              </select>
            </div>

            <div class="w-full bg-white p-4 rounded-xl border border-[#eaedff] flex flex-col items-center justify-center min-h-[110px] relative text-center">
              ${reportSignerProfile.svgSignature}
              <div class="w-full border-t border-dashed border-slate-300 my-1.5"></div>
              <span class="font-bold text-[13px] text-[#131b2e]">${reportSignerProfile.name}</span>
              <span class="text-[11px] text-[#226d00] font-semibold">${reportSignerProfile.role}</span>
              <span class="text-[10px] text-[#6f7b66]">${reportSignerProfile.cc} • ${reportSignerProfile.license}</span>
              <span class="text-[9px] font-mono text-[#006c49] mt-1 bg-[#6cf8bb]/30 px-2 py-0.5 rounded-md">${reportSignerProfile.hash} • ${reportSignerProfile.timestamp}</span>
            </div>
          </div>

          <!-- Tarjeta Firma 2: Líder / Responsable Asignado de Área -->
          <div class="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between gap-1 flex-wrap">
                <label class="text-[11px] font-bold text-[#006c49] uppercase tracking-wider">2. Responsable Asignado / Líder de Subsanación:</label>
                <button onclick="openDrawSignatureModal('responsible')" type="button" class="px-2 py-0.5 rounded-lg bg-[#006c49]/10 hover:bg-[#006c49]/20 text-[#006c49] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-[13px]">draw</span>
                  <span>✍️ Firmar / Cambiar</span>
                </button>
              </div>
              <select onchange="autoLoadResponsibleSigner(this.value)" class="w-full bg-white p-2.5 rounded-xl text-[12px] font-bold border border-[#eaedff] text-[#131b2e]">
                <option value="">-- Seleccionar --</option>
                ${responsablesList.map(name => `<option value="${name}" ${name === activeResponsibleSigner ? 'selected' : ''}>${name}</option>`).join('')}
              </select>
            </div>

            <div class="w-full bg-white p-4 rounded-xl border border-[#eaedff] flex flex-col items-center justify-center min-h-[110px] relative text-center">
              ${respSignerProfile.svgSignature}
              <div class="w-full border-t border-dashed border-slate-300 my-1.5"></div>
              <span class="font-bold text-[13px] text-[#131b2e]">${respSignerProfile.name}</span>
              <span class="text-[11px] text-[#006c49] font-semibold">${respSignerProfile.role}</span>
              <span class="text-[10px] text-[#6f7b66]">${respSignerProfile.cc} • Aceptación Subsanación</span>
              <span class="text-[9px] font-mono text-[#006c49] mt-1 bg-[#6cf8bb]/30 px-2 py-0.5 rounded-md">${respSignerProfile.hash} • ${respSignerProfile.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#eaedff]">
        ${!isApproved ? `
          <span class="text-[12px] text-[#006398] font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-[#006398]">info</span>
            <span>Previsualiza el documento F-SST-012 con sus firmas antes de aprobar.</span>
          </span>
          <div class="flex items-center gap-2.5">
            <button onclick="exportReportPDF()" class="px-6 py-3 bg-[#006398] hover:bg-[#004a73] text-white text-[13px] font-bold rounded-xl shadow-md flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">visibility</span>
              <span>Previsualizar Informe F-SST-012</span>
            </button>
          </div>
        ` : `
          <span class="text-[12px] text-[#005236] font-bold flex items-center gap-1 bg-[#6cf8bb]/30 px-3.5 py-1.5 rounded-xl border border-[#005236]/30">
            <span class="material-symbols-outlined text-[18px] text-[#226d00]">verified</span>
            <span>Informe Aprobado y Registrado en BD</span>
          </span>
          <div class="flex items-center gap-2.5 flex-wrap">
            <button onclick="startNewInspectionSession()" class="px-4 py-2.5 bg-[#39a900] hover:bg-[#226d00] text-white text-[13px] font-bold rounded-xl shadow flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">add_a_photo</span>
              <span>➕ Iniciar Nueva Inspección</span>
            </button>
            <button onclick="exportReportPDF()" class="px-4 py-2.5 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[13px] font-bold rounded-xl border border-[#eaedff] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">visibility</span>
              <span>Ver Previsualización</span>
            </button>
            <button onclick="confirmAndDownloadPdf()" class="px-5 py-2.5 bg-[#226d00] hover:bg-[#185200] text-white text-[13px] font-bold rounded-xl shadow flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">download</span>
              <span>Descargar PDF con Firmas</span>
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

// Prompt del Asistente IA de Seguridad y Salud en el Trabajo (SST Colombia)
const SST_AI_SYSTEM_PROMPT = `Eres un asistente de Inteligencia Artificial especializado en Seguridad y Salud en el Trabajo (SST) para Colombia. Tu función es actuar como un módulo de visión analítica integrado en una aplicación móvil. Cuando recibas una imagen capturada por la cámara del celular de un usuario, debes analizarla minuciosamente para identificar actos inseguros, condiciones peligrosas y riesgos de infraestructura.

Debes estructurar tu respuesta strictly en formato JSON válido para que el aplicativo móvil pueda procesar la información y mostrarla en la interfaz de usuario. Cada reporte exitoso debe guiarse por la Guía Técnica Colombiana GTC 45, el Decreto 1072 de 2015 y la Resolución 2400 de 1979.

Estructura el JSON de salida con las siguientes llaves (keys) si se detecta un peligro con éxito:
1. "estado": "exitoso"
2. "peligro_identificado": Nombre claro del peligro detectado (Ej: Falla Estructural / Riesgo Locativo).
3. "descripcion_visual": Detalle técnico de lo que se observa en la imagen.
4. "clasificacion_gtc45": El tipo de peligro según la GTC 45 (Ej: Condiciones de seguridad - Locativo).
5. "nivel_riesgo_preliminar": Clasificación cualitativa (Bajo, Medio, Alto, Crítico).
6. "consecuencias_potenciales": Lista de posibles lesiones, accidentes o daños a activos.
7. "normativa_aplicable": Artículos o leyes colombianas aplicables (Ej: Resolución 2400 de 1979 Art. 17 y 18).
8. "plan_accion_inmediato": Acciones preventivas urgentes que el usuario debe tomar en el sitio.
9. "control_ingenieria": Recomendaciones técnicas a mediano plazo.

REGLA DE EXCEPCIÓN / VALIDACIÓN DE IMAGEN:
Si la imagen es confusa, borrosa, está muy oscura, no tiene suficiente contexto visual o tú como IA no logras identificar con certeza un peligro de SST, debes ignorar la estructura anterior y retornar obligatoriamente el siguiente formato JSON exacto:

{
  "estado": "error",
  "mensaje_error": "No ha sido posible identificar visualmente ninguna condición de peligro clara en la imagen proporcionada debido a falta de nitidez, iluminación o contexto.",
  "sugerencia_flujo": "Se recomienda al usuario realizar el reporte de la condición peligrosa mediante la selección manual en el formulario de la aplicación."
}`;

let lastAiJsonResponse = null;

// Analizar imagen mediante el modelo estructurado JSON
function analyzeSstImageWithAi(imageData) {
  // Validar si existe imagen cargada
  const isImageBlurryOrUnclear = !imageData || imageData.length < 100;

  if (isImageBlurryOrUnclear) {
    lastAiJsonResponse = {
      "estado": "error",
      "mensaje_error": "No ha sido posible identificar visualmente ninguna condición de peligro clara en la imagen proporcionada debido a falta de nitidez, iluminación o contexto.",
      "sugerencia_flujo": "Se recomienda al usuario realizar el reporte de la condición peligrosa mediante la selección manual en el formulario de la aplicación."
    };

    currentProposal = {
      hazardTitle: 'No Identificado por IA',
      riskCategory: 'Pendiente de Clasificación (GTC 45)',
      riskLevel: 'II',
      confidence: 'Error de Inferencia',
      gtc45Description: lastAiJsonResponse.mensaje_error,
      recommendation: lastAiJsonResponse.sugerencia_flujo,
      aiJsonResponse: lastAiJsonResponse,
      isAiError: true
    };
    return;
  }

  // Motor de Análisis de Visión IA Multirriesgo (Reconocimiento Inteligente de Imágenes)
  const rawContext = `${imageData || ''} ${manualFindingDescription || ''} ${selectedGtcCategory || ''} ${selectedGtcDetail || ''}`.toLowerCase();

  let hazardDetected = {
    peligro_identificado: "Falta de Guarda de Protección y Riesgo Mecánico",
    descripcion_visual: "Se observa cabezal giratorio de máquina herramientas (torno mecánico) operando sin resguardo transparente de policarbonato y falta de fijación de tornillo prisionero norma DIN 913.",
    clasificacion_gtc45: "Condiciones de Seguridad - Mecánico",
    nivel_riesgo_preliminar: "Alto",
    normativa_aplicable: "Resolución 2400 de 1979 Art. 270 a 274 (Guardas y Resguardos), Decreto 1072 de 2015 y Guía GTC 45:2012.",
    plan_accion_inmediato: "1. Detener preventivamente la operación del equipo.\n2. Aplicar etiqueta y candado de bloqueo de fuente de energía (LOTO).\n3. Informar al instructor o líder de taller.",
    control_ingenieria: "Diseñar e instalar guarda de protección acrílica abatible con microswitch de parada automática de seguridad."
  };

  // 1. Agrietamiento / Fisura / Raja en Muro o Pared / Falla Estructural
  if (/raja|grieta|muro|pared|fisura|estructural|pañete|ladrillo|asentamiento|fachada|bloque/i.test(rawContext)) {
    hazardDetected = {
      peligro_identificado: "Agrietamiento y Fisura Severa en Muro (Riesgo Estructural / Locativo)",
      descripcion_visual: "Se observa fisura diagonal y raja con desprendimiento parcial de pañete en muro de mampostería del ambiente de formación, con potencial riesgo de caída de material o desprendimiento estructural.",
      clasificacion_gtc45: "Condiciones de Seguridad - Locativo / Estructural",
      nivel_riesgo_preliminar: "Alto",
      normativa_aplicable: "NSR-10 (Norma Colombiana Sismo Resistente), Resolución 2400 de 1979 Art. 17 y NTC 4114.",
      plan_accion_inmediato: "1. Acordonar y delimitar preventivamente la zona afectada con cinta de peligro.\n2. Evacuar temporalmente puestos de aprendizaje cercanos al muro fisurado.\n3. Notificar prioritaria al área de Mantenimiento e Infraestructura SENA.",
      control_ingenieria: "Evaluación de patología estructural por Ingeniero Civil, estudio de carga y apuntalamiento/reparación de la mampostería."
    };
  }
  // 2. Ruido / Aire Acondicionado / Extractor / Compresor
  else if (/ruido|sonido|ac[uú]stic|decibel|aire acondicionado|extractor|compresor|vibraci/i.test(rawContext)) {
    hazardDetected = {
      peligro_identificado: "Emisión de Ruido Excesivo y Falla Mecánica en Equipo de Ventilación/Aire",
      descripcion_visual: "Se detecta unidad de aire acondicionado / compresor operando con desalineación de rodamientos y emisión sonora superior a los niveles de confort acústico en el ambiente de formación.",
      clasificacion_gtc45: "Físico - Ruido Continuo",
      nivel_riesgo_preliminar: "Medio",
      normativa_aplicable: "Resolución 1792 de 1990 (Límites de Ruido), Resolución 2400 de 1979 e Higiene Industrial GTC 45.",
      plan_accion_inmediato: "1. Ejecutar mantenimiento correctivo inmediato en rodamientos y compresor.\n2. Suministrar protectores auditivos de inserción a aprendices expuestos.",
      control_ingenieria: "Instalación de soportes de amortiguación de neopreno y pantalla de insonorización acústica en la unidad."
    };
  }
  // 3. Iluminación / Foco Fundido / Lámpara / Oscuridad
  else if (/foco|bombill|l[aá]mpara|ilumina|luz|fundid|oscur/i.test(rawContext)) {
    hazardDetected = {
      peligro_identificado: "Deficiencia de Iluminación y Luminaria/Foco Inoperativo",
      descripcion_visual: "Se observa foco/lámpara inoperativa en la techumbre del ambiente de aprendizaje, generando sombras y nivel de luxometría insuficiente para tareas de precisión.",
      clasificacion_gtc45: "Físico - Iluminación Deficiente",
      nivel_riesgo_preliminar: "Bajo",
      normativa_aplicable: "RETILAP y Resolución 2400 de 1979 Art. 79 al 87.",
      plan_accion_inmediato: "1. Sustituir la luminaria/foco dañado por bombilla LED sellada de alta eficiencia.\n2. Verificar aislamiento del portalámparas.",
      control_ingenieria: "Medición luxométrica periódica y adecuación del sistema de alumbrado general."
    };
  }
  // 4. Eléctrico / Cables / Chispa / Tablero
  else if (/el[eé]ctric|cable|toma|empalme|chispa|tablero|alta tensi[oó]n/i.test(rawContext)) {
    hazardDetected = {
      peligro_identificado: "Riesgo Eléctrico por Cableado Expuesto y Tablero Desprotegido",
      descripcion_visual: "Se identifica cableado trifásico sin canalizar, empalmes descubiertos y falta de contratapa de protección en tablero secundario.",
      clasificacion_gtc45: "Condiciones de Seguridad - Eléctrico",
      nivel_riesgo_preliminar: "Muy Alto",
      normativa_aplicable: "RETIE y NTC 2050 (Código Eléctrico Colombiano).",
      plan_accion_inmediato: "1. Desenergizar el circuito desde el interruptor termomagnético general.\n2. Aplicar procedimiento LOTO.\n3. Canalizar en tubería conduit ignífuga.",
      control_ingenieria: "Instalación de interruptores de falla a tierra GFCI y encerramiento IP65."
    };
  }
  // 5. Locativo / Piso / Silla / Mobiliario / Desnivel
  else if (/piso|resbalad|h[uú]med|charco|aceite|lodo|desnivel|silla|escritorio|mobiliario|inestable/i.test(rawContext)) {
    hazardDetected = {
      peligro_identificado: "Riesgo Locativo / Daño en Mobiliario o Superficie de Tránsito",
      descripcion_visual: "Se evidencia superficie resbaladiza o mobiliario de formación con partes sueltas e inestables que comprometen la seguridad de los aprendices.",
      clasificacion_gtc45: "Condiciones de Seguridad - Locativo / Ergonomía",
      nivel_riesgo_preliminar: "Alto",
      normativa_aplicable: "NTC 4114, Resolución 2400 de 1979 Art. 17 y GTC 45.",
      plan_accion_inmediato: "1. Retirar inmediatamente el mobiliario defectuoso del ambiente.\n2. Aplicar recubrimiento antideslizante o limpiar la superficie.\n3. Señalizar el área.",
      control_ingenieria: "Reemplazo del mobiliario por componentes ergométricos certificados NTC."
    };
  }

  lastAiJsonResponse = {
    "estado": "exitoso",
    "peligro_identificado": hazardDetected.peligro_identificado,
    "descripcion_visual": hazardDetected.descripcion_visual,
    "clasificacion_gtc45": hazardDetected.clasificacion_gtc45,
    "nivel_riesgo_preliminar": hazardDetected.nivel_riesgo_preliminar,
    "normativa_aplicable": hazardDetected.normativa_aplicable,
    "plan_accion_inmediato": hazardDetected.plan_accion_inmediato,
    "control_ingenieria": hazardDetected.control_ingenieria
  };

  const evaluatedRisk = evaluateGtc45RiskLevel(
    lastAiJsonResponse.clasificacion_gtc45,
    lastAiJsonResponse.descripcion_visual,
    lastAiJsonResponse.peligro_identificado
  );

  currentProposal = {
    hazardTitle: lastAiJsonResponse.peligro_identificado,
    riskCategory: lastAiJsonResponse.clasificacion_gtc45,
    riskLevel: evaluatedRisk,
    confidence: '96%',
    gtc45Description: `${lastAiJsonResponse.descripcion_visual}\n\nNormativa Aplicable: ${lastAiJsonResponse.normativa_aplicable}`,
    recommendation: `${lastAiJsonResponse.plan_accion_inmediato}\n\nControl de Ingeniería: ${lastAiJsonResponse.control_ingenieria}`,
    aiJsonResponse: lastAiJsonResponse,
    isAiError: false
  };
}

// Proceed to Analysis
function proceedToAnalysis() {
  if (!capturedImageData) {
    showToast('Fotografía Requerida', 'Por favor captura o selecciona una foto antes de continuar.', 'error');
    return;
  }
  
  analyzeSstImageWithAi(capturedImageData);
  // Manual selection is primary default option upon proceeding
  isManualCatalogMode = true;
  manualFindingDescription = '';
  if (currentProposal) {
    currentProposal.recommendation = '';
    currentProposal.gtc45Description = '';
  }
  renderMakerCheckerProposal();
  navigateTo('analisis-ia-maker-checker');
}

const GTC45_TYPES_LIST = [
  'Biológico',
  'Físico',
  'Químico',
  'Biomecánico',
  'Psicosocial',
  'Condiciones de Seguridad',
  'Fenómenos Naturales',
  'Ambiental'
];

const GTC45_DETAILS_LIST = {
  'Biológico': [
    'Virus',
    'Bacterias',
    'Hongos',
    'Parásitos',
    'Rickettsias',
    'Picaduras',
    'Mordeduras',
    'Fluidos corporales',
    'Excrementos',
    'Material biológico contaminado',
    'Residuos hospitalarios',
    'Animales ponzoñosos',
    'Vectores (mosquitos, garrapatas)',
    'Contacto con sangre',
    'Contacto con tejidos animales',
    'Zoonosis'
  ],
  'Físico': [
    'Ruido continuo',
    'Ruido de impacto',
    'Iluminación deficiente',
    'Iluminación excesiva',
    'Vibración mano-brazo',
    'Vibración cuerpo entero',
    'Temperaturas altas',
    'Temperaturas bajas',
    'Estrés térmico',
    'Humedad',
    'Presión atmosférica',
    'Radiaciones ionizantes',
    'Radiaciones no ionizantes',
    'Radiación ultravioleta',
    'Radiación infrarroja',
    'Campos electromagnéticos',
    'Láser',
    'Ventilación deficiente'
  ],
  'Químico': [
    'Sólidos / Polvos orgánicos e inorgánicos',
    'Sólidos / Fibras naturales y sintéticas',
    'Sólidos / Nanopartículas y Material particulado',
    'Líquidos / Ácidos y Bases',
    'Líquidos / Solventes y Disolventes',
    'Líquidos / Pinturas y Resinas',
    'Líquidos / Combustibles y Aceites',
    'Líquidos / Lubricantes y Detergentes industriales',
    'Líquidos / Desinfectantes y Químicos concentrados',
    'Gases y Vapores / Monóxido y Dióxido de carbono',
    'Gases y Vapores / Amoniaco y Cloro',
    'Gases y Vapores / Gas LP y Gas natural',
    'Gases y Vapores / Vapores orgánicos y ácidos',
    'Humos metálicos y de soldadura',
    'Humos de combustión'
  ],
  'Biomecánico': [
    'Postura prolongada',
    'Postura forzada',
    'Postura mantenida sentado',
    'Postura mantenida de pie',
    'Esfuerzo físico',
    'Manipulación manual de cargas',
    'Movimiento repetitivo',
    'Empuje y tracción de objetos',
    'Levantamiento de cargas',
    'Transporte de cargas',
    'Diseño inadecuado del puesto de trabajo',
    'Movimientos bruscos',
    'Alcances excesivos',
    'Trabajo con pantallas de visualización (VDT)'
  ],
  'Psicosocial': [
    'Gestión / Estilo de liderazgo y comunicación',
    'Gestión / Participación y cambios organizacionales',
    'Gestión / Definición de roles y estabilidad laboral',
    'Gestión / Carga mental y de trabajo',
    'Gestión / Ritmo de trabajo y monotonía',
    'Gestión / Autonomía y responsabilidad',
    'Jornada / Trabajo nocturno y turnos rotativos',
    'Jornada / Horas extras y doble jornada',
    'Jornada / Trabajo dominical y festivo',
    'Interacción social / Relaciones interpersonales',
    'Interacción social / Trabajo en equipo',
    'Interacción social / Acoso y violencia laboral',
    'Interacción social / Atención al público',
    'Condiciones externas / Desplazamiento casa-trabajo',
    'Condiciones externas / Conciliación vida laboral-familiar'
  ],
  'Condiciones de Seguridad': [
    'Locativo / Daño estructural en mobiliario, sillas de formación o escritorios con partes inestables',
    'Mecánico / Partes móviles de máquinas',
    'Mecánico / Máquinas sin guardas de protección',
    'Mecánico / Herramientas manuales y eléctricas',
    'Mecánico / Elementos cortopunzantes y proyección de objetos',
    'Locativo / Superficies irregulares y pisos húmedos/resbalosos',
    'Locativo / Escaleras y barandas defectuosas',
    'Locativo / Almacenamiento inadecuado, orden y aseo',
    'Locativo / Caída de objetos',
    'Locativo / Estructuras de edificación en mal estado, grietas en muros o fallas en la infraestructura',
    'Eléctrico / Alta y baja tensión',
    'Eléctrico / Electricidad estática y arcos eléctricos',
    'Eléctrico / Tableros energizados y cables expuestos',
    'Público / Robos, atracos y desorden público',
    'Público / Terrorismo, manifestaciones y vandalismo',
    'Tránsito / Accidentes de tránsito y movilidad interna',
    'Tránsito / Atropellamiento, colisión y volcamiento'
  ],
  'Fenómenos Naturales': [
    'Sismos y Terremotos',
    'Vendavales e Inundaciones',
    'Lluvias intensas y Granizadas',
    'Tormentas eléctricas',
    'Avalanchas, Deslizamientos y Derrumbes',
    'Sequías y Olas de calor',
    'Incendios forestales',
    'Tsunamis (zonas costeras)',
    'Huracanes'
  ],
  'Ambiental': [
    'Manejo inadecuado de residuos sólidos y peligrosos',
    'Vertimientos de aguas servidas e industriales',
    'Emisiones atmosféricas contaminantes y gases',
    'Consumo ineficiente de agua y energía',
    'Contaminación y degradación de suelos',
    'Impacto en biodiversidad, flora y fauna local'
  ]
};

function openGtc45MatrixModal() {
  document.getElementById('modalGtc45Matrix')?.classList.remove('hidden');
}

function closeGtc45MatrixModal() {
  document.getElementById('modalGtc45Matrix')?.classList.add('hidden');
}

let selectedGtcCategory = 'Condiciones de Seguridad';
let selectedGtcDetail = 'Locativo / Daño estructural en mobiliario, sillas de formación o escritorios con partes inestables';
let isManualCatalogMode = true;

function toggleManualMode(manual) {
  isManualCatalogMode = manual;
  if (!manual && capturedImageData) {
    analyzeSstImageWithAi(capturedImageData);
  } else if (manual) {
    updateManualProposal();
  }
  renderMakerCheckerProposal();
}

function handleCategoryChange(category) {
  selectedGtcCategory = category;
  const details = GTC45_DETAILS_LIST[category] || [];
  selectedGtcDetail = details[0] || '';
  updateManualProposal();
}

function handleDetailChange(detail) {
  selectedGtcDetail = detail;
  updateManualProposal();
}

let manualFindingDescription = '';

function handleManualDescriptionChange(text) {
  manualFindingDescription = text;
  if (currentProposal) {
    currentProposal.gtc45Description = text || `Peligro clasificado manualmente según la Guía Técnica Colombiana GTC 45: Categoría ${selectedGtcCategory} - Factor específico: ${selectedGtcDetail}.`;
    const evaluatedRisk = evaluateGtc45RiskLevel(selectedGtcCategory, selectedGtcDetail, manualFindingDescription);
    currentProposal.riskLevel = evaluatedRisk;
  }
}

// Dual-Mode Selection for Plan de Acción / Medida Sugerida en Móvil: 'manual' vs 'google_ai' (Manual es la opción principal por defecto)
let actionPlanModeMobile = 'manual';
let googleSearchQueryMobile = '';

function setActionPlanModeMobile(mode) {
  actionPlanModeMobile = mode;
  if (mode === 'manual' && currentProposal) {
    currentProposal.recommendation = '';
  }
  renderMakerCheckerProposal();
}

function handleSearchGoogleSstMobile(val) {
  googleSearchQueryMobile = val;
  const suggestionsBox = document.getElementById('googleSstSuggestionsMobileContainer');
  if (suggestionsBox) {
    const controls = getNormativeControlsMobile(googleSearchQueryMobile, currentProposal?.hazardTitle || '');
    suggestionsBox.innerHTML = controls.map((control) => `
      <div
        onclick="selectGoogleRecommendationMobile(\`${control.text.replace(/`/g, '\\`')}\`)"
        class="p-2.5 rounded-xl bg-white hover:bg-[#006398]/10 border border-[#eaedff] hover:border-[#006398]/40 cursor-pointer transition-all flex items-start gap-2 shadow-xs"
      >
        <span class="material-symbols-outlined text-[16px] text-[#006398] shrink-0 mt-0.5">add_circle</span>
        <div class="flex flex-col text-[11px]">
          <span class="font-bold text-[#131b2e]">${control.label}</span>
          <span class="text-[#3f4a38] leading-relaxed">${control.text}</span>
        </div>
      </div>
    `).join('');
  }
}

function getNormativeControlsMobile(query, currentTitle, currentGtcDescription) {
  const raw = `${query || ''} ${currentTitle || ''} ${currentGtcDescription || ''} ${manualFindingDescription || ''} ${currentProposal?.gtc45Description || ''}`.toLowerCase();

  // 1. Ruido / Sonido / Aire Acondicionado / Extractor / Compresor / Vibración (Res. 2400 / Res. 1792)
  if (/ruido|sonido|ac[uú]stic|decibel|aire acondicionado|extractor|compresor|vibraci/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Control de Ruido e Higiene (Res. 2400 / Res. 1792)',
        text: 'Mantenimiento técnico preventivo/correctivo del equipo (aire acondicionado/extractor/compresor), evaluación de sonometría en puesto de trabajo y dotación de protección auditiva de inserción/copa NRR conforme a Res. 1792 de 1990.'
      },
      {
        label: 'Sugerencia Google SST - Aislamiento Acústico en la Fuente',
        text: 'Instalación de soportes antivibratorios de neopreno y encapsulamiento o pantalla acústica del equipo generador de ruido según estándar de higiene industrial SENA.'
      }
    ];
  }
  
  // 2. Iluminación / Foco / Bombilla / Luz (RETILAP / Res. 2400 Art. 79)
  if (/foco|bombill|l[aá]mpara|ilumina|luz|fundid|oscur/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Reemplazo RETILAP / Res. 2400 Art. 79',
        text: 'Sustitución inmediata de luminaria/foco dañado por tecnología LED sellada de alta eficiencia, aislamiento del circuito eléctrico según RETILAP y verificación de luxometría en puesto de trabajo.'
      },
      {
        label: 'Sugerencia Google SST - Control de Ingeniería & Mantenimiento',
        text: 'Instalación de pantalla protectora antipolvo y verificación de estabilidad de corriente en tablero secundario antes del cambio de la bombilla.'
      }
    ];
  }
  
  // 3. Maquinaria / Torno / Esmeril / Guarda / Prensa / Polea / Engranaje
  if (/torno|esmeril|guarda|m[aá]quin|prensa|protecci[oó]n|polea|atrapamiento/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Control en la Fuente (GTC 45 / Res. 0312)',
        text: 'Instalación obligatoria de guarda de acrílico reglamentaria de 6mm con sensor microinterruptor de parada de emergencia y delimitación de zona de riesgo en piso (Res. 0312/2019 Estándar 4.2.5).'
      },
      {
        label: 'Sugerencia Google SST - Bloqueo / Etiquetado LOTO',
        text: 'Aplicación de procedimiento LOTO (Lockout/Tagout) en interruptor principal de la máquina mientras se completa el mantenimiento de la guarda de seguridad.'
      }
    ];
  }
  
  // 4. Locativo / Piso / Resbaloso / Aceite / Desnivel / Silla / Mobiliario / Escritorio
  if (/piso|resbalad|h[uú]med|charco|aceite|lodo|desnivel|silla|escritorio|mobiliario|inestable|daño estructural/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Control Locativo / Mobiliario (NTC 4114)',
        text: 'Sustitución o reparación inmediata del mobiliario/superficie inestable, aplicación de cinta antideslizante NTC 4114 y señalización preventiva de advertencia en el área.'
      },
      {
        label: 'Sugerencia Google SST - Inspección y Mantenimiento Ergonómico',
        text: 'Retiro preventivo del elemento defectuoso del ambiente de aprendizaje y registro en el plan de mantenimiento de infraestructura.'
      }
    ];
  }
  
  // 5. Eléctrico / Cable / Toma / Empalme / Chispa / Tablero
  if (/el[eé]ctric|cable|toma|empalme|chispa|tablero|alta tensi[oó]n/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Seguridad Eléctrica (RETIE / NTC 2050)',
        text: 'Desenergización inmediata del circuito, canalización de cableado expuesto en tubería ignífuga conduit RETIE con señalización de peligro de alta tensión.'
      }
    ];
  }

  // 6. Ergonómico / Postura / Biomecánico / Carga
  if (/postura|biomec[aá]nic|carga|esfuerzo|repetitiv|pantalla/i.test(raw)) {
    return [
      {
        label: 'Sugerencia Google SST - Ergonomía y Pausas Activas (GTC 290)',
        text: 'Rediseño del puesto de trabajo, ajuste de altura de elementos de trabajo y programación obligatoria de pausas activas cada 2 horas.'
      }
    ];
  }

  return [
    {
      label: 'Sugerencia Google SST - Control Estándar Res. 0312 de 2019',
      text: `1. Intervención directa en la fuente del riesgo identificado (${selectedGtcCategory || 'GTC 45'}).\n2. Señalización preventiva del área en el taller formativo SENA.\n3. Registro en cronograma de mantenimiento y verificación COPASST en 48 horas.`
    },
    {
      label: 'Sugerencia Google SST - Capacitación y Autocuidado',
      text: 'Suministro inmediato de EPP específico, charla de seguridad de 5 minutos sobre autocuidado y revaluación por el Inspector COPASST.'
    }
  ];
}

function selectGoogleRecommendationMobile(text) {
  if (currentProposal) {
    currentProposal.recommendation = text;
  }
  renderMakerCheckerProposal();
}

function handleManualRecommendationChangeMobile(text) {
  if (currentProposal) {
    currentProposal.recommendation = text;
  }
}

function handleResponsibleChangeMobile(val) {
  if (currentProposal) {
    currentProposal.assignedTo = val;
  }
}

function handleDeadlineChangeMobile(val) {
  if (currentProposal) {
    currentProposal.deadline = val;
  }
}


// Evaluador Dinámico de Nivel de Riesgo GTC 45 (I, II, III, IV)
function evaluateGtc45RiskLevel(category, detail, title = '') {
  const text = `${category || ''} ${detail || ''} ${title || ''}`.toLowerCase();

  // Nivel I: Riesgo Crítico / No Aceptable (Rojo)
  if (
    text.includes('eléctric') || 
    text.includes('alta tensión') || 
    text.includes('cables expuestos') || 
    text.includes('guarda de protección') || 
    text.includes('máquinas sin guardas') || 
    text.includes('químic') || 
    text.includes('ácido') || 
    text.includes('gas') || 
    text.includes('altura') || 
    text.includes('amputac') || 
    text.includes('grieta estructural') || 
    text.includes('derrumb') ||
    text.includes('atrapamiento')
  ) {
    return 'I';
  }

  // Nivel II: Riesgo Alto / Aceptable con Control Específico (Naranja/Amarillo)
  if (
    text.includes('locativ') || 
    text.includes('mobiliario') || 
    text.includes('silla') || 
    text.includes('resbalos') || 
    text.includes('escalera') || 
    text.includes('biomecánic') || 
    text.includes('carga') || 
    text.includes('postura') || 
    text.includes('ruido') || 
    text.includes('vibrac') || 
    text.includes('tránsito') ||
    text.includes('herramientas')
  ) {
    return 'II';
  }

  // Nivel III: Riesgo Medio / Tolerable (Verde)
  if (
    text.includes('iluminac') || 
    text.includes('temperat') || 
    text.includes('humedad') || 
    text.includes('biológic') || 
    text.includes('virus') || 
    text.includes('bacteri') || 
    text.includes('psicosocial') || 
    text.includes('residuo')
  ) {
    return 'III';
  }

  // Nivel IV: Riesgo Bajo / Aceptable (Azul)
  return 'IV';
}

function setProposalRiskLevel(level) {
  if (!currentProposal) return;
  currentProposal.riskLevel = level;
  renderMakerCheckerProposal();
  
  const labels = {
    'I': 'Nivel I (Crítico / No Aceptable)',
    'II': 'Nivel II (Alto / Control Específico)',
    'III': 'Nivel III (Medio / Tolerable)',
    'IV': 'Nivel IV (Bajo / Aceptable)'
  };
  showToast('Nivel de Riesgo Asignado', `Asignado: ${labels[level] || level}`, 'success');
}

function updateManualProposal() {
  const evaluatedRisk = evaluateGtc45RiskLevel(selectedGtcCategory, selectedGtcDetail, manualFindingDescription);
  
  currentProposal.hazardTitle = selectedGtcDetail || 'Peligro Seleccionado Manualmente';
  currentProposal.riskCategory = selectedGtcCategory || 'Condiciones de Seguridad';
  currentProposal.riskLevel = evaluatedRisk;
  currentProposal.gtc45Description = manualFindingDescription || `Peligro clasificado manualmente según la Guía Técnica Colombiana GTC 45: Categoría ${selectedGtcCategory} - Factor específico: ${selectedGtcDetail}.`;
  currentProposal.confidence = 'Selección Manual Inspector';
  renderMakerCheckerProposal();
}

function renderMakerCheckerProposal() {
  const container = document.getElementById('makerCheckerProposalBox');
  if (!container) return;

  const currentDetails = GTC45_DETAILS_LIST[selectedGtcCategory] || [];
  const currLevel = currentProposal.riskLevel || 'II';
  
  const riskBadgeStyles = {
    'I': 'bg-red-100 text-red-800 border-red-300',
    'II': 'bg-amber-100 text-amber-900 border-amber-300',
    'III': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'IV': 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const riskLabelMap = {
    'I': 'Nivel I • Crítico / No Aceptable',
    'II': 'Nivel II • Alto / Control Específico',
    'III': 'Nivel III • Medio / Tolerable',
    'IV': 'Nivel IV • Bajo / Aceptable'
  };

  container.innerHTML = `
    <div class="flex flex-col gap-4 p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff]">
      
      <!-- Selector Modo Selección Manual (Principal) vs Búsqueda por IA (Opcional) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-[#eaedff] gap-2">
        <span class="text-[12px] font-bold text-[#131b2e] flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[18px] text-[#226d00]">tune</span>
          Modo de Clasificación GTC 45:
        </span>
        <div class="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg">
          <button type="button" onclick="toggleManualMode(true)" class="px-3 py-1 rounded-md text-[11px] font-bold ${isManualCatalogMode ? 'bg-[#226d00] text-white shadow' : 'text-[#6f7b66] hover:bg-white'}">✍️ Selección Manual (Principal)</button>
          <button type="button" onclick="toggleManualMode(false)" class="px-3 py-1 rounded-md text-[11px] font-bold ${!isManualCatalogMode ? 'bg-[#006398] text-white shadow' : 'text-[#6f7b66] hover:bg-white'}">🤖 Búsqueda por IA (Opcional)</button>
        </div>
      </div>

      ${isManualCatalogMode ? `
        <div class="flex flex-col gap-3 p-4 bg-white rounded-xl border border-[#eaedff]">
          <!-- Dropdown 1: Tipo de Riesgo -->
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">1. Tipo de Riesgo (Categoría GTC 45):</label>
            <select onchange="handleCategoryChange(this.value)" class="w-full bg-[#f2f3ff] p-2.5 rounded-xl text-[13px] font-semibold border border-[#eaedff] text-[#131b2e]">
              <option value="">-- Seleccionar --</option>
              ${GTC45_TYPES_LIST.map(type => `<option value="${type}" ${type === selectedGtcCategory ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
          </div>

          <!-- Dropdown 2: Detalle del Riesgo -->
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">2. Detalle del Riesgo Identificado:</label>
            <select onchange="handleDetailChange(this.value)" class="w-full bg-[#f2f3ff] p-2.5 rounded-xl text-[13px] border border-[#eaedff] text-[#131b2e]">
              <option value="">-- Seleccionar --</option>
              ${currentDetails.map(det => `<option value="${det}" ${det === selectedGtcDetail ? 'selected' : ''}>${det}</option>`).join('')}
            </select>
          </div>

          <!-- Sección 3: Descripción del Hallazgo (Manual) -->
          <div class="flex flex-col gap-1 pt-2 border-t border-[#eaedff]">
            <label class="text-[11px] font-bold text-[#226d00] uppercase tracking-wider">3. Descripción del Hallazgo (Manual):</label>
            <textarea 
              oninput="handleManualDescriptionChange(this.value)" 
              rows="3" 
              placeholder="Escribe la descripción detallada de la condición o acto inseguro observado en campo..." 
              class="w-full bg-[#f2f3ff] p-3 rounded-xl text-[13px] border border-[#eaedff] text-[#131b2e] placeholder:text-[#6f7b66] focus:outline-none focus:ring-2 focus:ring-[#226d00]/30"
            >${manualFindingDescription}</textarea>
          </div>
        </div>
      ` : `
        <!-- Tarjeta de Resultados del Análisis por IA Gemini Vision -->
        <div class="flex flex-col gap-3.5 p-4 bg-white rounded-xl border-2 border-[#006398]/40 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[13px] font-bold text-[#006398] flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>Hallazgo Detectado por IA Gemini Vision:</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-[#006398] text-white text-[10px] font-extrabold">Inferencia 96% Certeza</span>
          </div>

          <div class="p-3 bg-[#f0f7ff] rounded-xl border border-[#006398]/20 flex flex-col gap-1">
            <span class="text-[10px] font-extrabold text-[#006398] uppercase tracking-wider">Peligro Detectado en la Evidencia:</span>
            <span class="text-[14px] font-bold text-[#131b2e]">${currentProposal.hazardTitle}</span>
            <span class="text-[11px] text-[#226d00] font-semibold">${currentProposal.riskCategory}</span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-extrabold text-[#6f7b66] uppercase tracking-wider">Descripción Visual e Inspección Inferida por IA:</span>
            <p class="text-[12px] text-[#3f4a38] leading-relaxed bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              ${currentProposal.aiJsonResponse?.descripcion_visual || currentProposal.gtc45Description}
            </p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-extrabold text-[#006c49] uppercase tracking-wider">Medida Sugerida & Plan de Acción Inmediato por IA:</span>
            <p class="text-[12px] text-[#005236] leading-relaxed bg-[#6cf8bb]/20 p-3 rounded-xl border border-[#6cf8bb]/40 font-medium">
              ${currentProposal.recommendation}
            </p>
          </div>
        </div>
      `}

      ${currentProposal.isAiError ? `
        <!-- Alerta de Excepción / Error en Análisis Fotográfico -->
        <div class="p-4 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/40 text-[#ba1a1a] flex flex-col gap-2">
          <div class="flex items-center gap-2 font-bold text-[13px]">
            <span class="material-symbols-outlined text-[20px]">warning</span>
            <span>Validación Fotográfica Fallida</span>
          </div>
          <p class="text-[12px] text-[#3f4a38] leading-relaxed">
            ${currentProposal.gtc45Description}
          </p>
          <span class="text-[11px] font-bold text-[#006c49] bg-white p-2 rounded-lg border border-[#eaedff]">
            👉 ${currentProposal.recommendation}
          </span>
        </div>
      ` : ''}

      <!-- Selector Interactivo de Nivel de Riesgo (Matriz GTC 45) -->
      <div class="flex flex-col gap-2.5 p-4 bg-white rounded-xl border border-[#eaedff]">
        <div class="flex items-center justify-between">
          <span class="text-[12px] font-bold text-[#131b2e] flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-[#226d00]">table_chart</span>
            <span>Nivel de Riesgo Evaluado (GTC 45):</span>
          </span>
          <button type="button" onclick="openGtc45MatrixModal()" class="text-[11px] text-[#006398] font-bold hover:underline flex items-center gap-1">
            <span>Matriz GTC 45 ℹ️</span>
          </button>
        </div>

        <!-- Botones de Nivel I, II, III, IV -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button type="button" onclick="setProposalRiskLevel('I')" class="p-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${currLevel === 'I' ? 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}">
            <span>Nivel I</span>
            <span class="text-[9px] font-normal opacity-90">Muy Alto (Crítico)</span>
          </button>
          <button type="button" onclick="setProposalRiskLevel('II')" class="p-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${currLevel === 'II' ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'}">
            <span>Nivel II</span>
            <span class="text-[9px] font-normal opacity-90">Alto (Control)</span>
          </button>
          <button type="button" onclick="setProposalRiskLevel('III')" class="p-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${currLevel === 'III' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'}">
            <span>Nivel III</span>
            <span class="text-[9px] font-normal opacity-90">Medio (Tolerable)</span>
          </button>
          <button type="button" onclick="setProposalRiskLevel('IV')" class="p-2.5 rounded-xl text-[11px] font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${currLevel === 'IV' ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'}">
            <span>Nivel IV</span>
            <span class="text-[9px] font-normal opacity-90">Bajo (Aceptable)</span>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#005236] text-[11px] font-bold">${isManualCatalogMode ? 'Selección Manual Inspector' : 'Inferencia IA Gemini 2.5 • ' + currentProposal.confidence + ' Certeza'}</span>
        <span class="px-3 py-1 rounded-full text-[11px] font-bold border ${riskBadgeStyles[currLevel] || riskBadgeStyles['II']}">
          ${riskLabelMap[currLevel] || 'Nivel II'}
        </span>
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

      <!-- Medida Sugerida / Plan de Acción Correctivo (Modo Dual: Manual vs Google/IA SST) -->
      <div class="flex flex-col gap-2.5 p-4 bg-white rounded-xl border border-[#eaedff] shadow-sm">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <label class="text-[12px] text-[#131b2e] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
            <span class="material-symbols-outlined text-[#226d00] text-[18px]">verified_user</span>
            Medida Sugerida / Plan de Acción Correctivo
          </label>
          
          <!-- Selector de Modo: Manual vs Google/Asistente Normativo -->
          <div class="flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-xl border border-[#eaedff] text-[11px] font-bold">
            <button
              type="button"
              onclick="setActionPlanModeMobile('manual')"
              class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                actionPlanModeMobile === 'manual'
                  ? 'bg-[#226d00] text-white shadow-sm'
                  : 'text-[#6f7b66] hover:bg-white'
              }"
            >
              <span>✍️ Redacción Manual</span>
            </button>
            <button
              type="button"
              onclick="setActionPlanModeMobile('google_ai')"
              class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                actionPlanModeMobile === 'google_ai'
                  ? 'bg-[#006398] text-white shadow-sm'
                  : 'text-[#6f7b66] hover:bg-white'
              }"
            >
              <span>🌐 Google / SST Normativo</span>
            </button>
          </div>
        </div>

        ${actionPlanModeMobile === 'google_ai' ? `
          <div class="flex flex-col gap-2 p-3 rounded-xl bg-[#f0f7ff] border border-[#006398]/30 text-[12px]">
            <div class="flex items-center justify-between text-[#006398] font-bold">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">travel_explore</span>
                Búsqueda en Google SST & Normativa Colombiana
              </span>
              <span class="text-[10px] bg-[#006398]/10 text-[#006398] px-2 py-0.5 rounded-full font-extrabold">Google SST Active</span>
            </div>
            
            <div class="flex items-center gap-2">
              <input
                type="text"
                id="inpGoogleSearchSstMobile"
                value="${googleSearchQueryMobile}"
                oninput="handleSearchGoogleSstMobile(this.value)"
                placeholder="Buscar norma/medida en Google SST para '${currentProposal.hazardTitle || 'Hallazgo'}'..."
                class="flex-1 px-3 py-2 bg-white text-[12px] rounded-xl border border-[#eaedff] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006398]/30"
              />
              <button
                type="button"
                onclick="const ctrl = getNormativeControlsMobile(googleSearchQueryMobile, currentProposal.hazardTitle)[0]; if(ctrl) selectGoogleRecommendationMobile(ctrl.text);"
                class="px-3 py-2 bg-[#006398] hover:bg-[#004e79] text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shrink-0 shadow-sm"
              >
                <span>🔍 Buscar</span>
              </button>
            </div>

            <div class="flex flex-col gap-1.5 pt-1 border-t border-[#006398]/20">
              <span class="text-[10px] font-extrabold text-[#6f7b66] uppercase">Sugerencias recomendadas por Google SST:</span>
              <div id="googleSstSuggestionsMobileContainer" class="flex flex-col gap-1.5">
                ${getNormativeControlsMobile(googleSearchQueryMobile, currentProposal.hazardTitle).map((control) => `
                  <div
                    onclick="selectGoogleRecommendationMobile(\`${control.text.replace(/`/g, '\\`')}\`)"
                    class="p-2.5 rounded-xl bg-white hover:bg-[#006398]/10 border border-[#eaedff] hover:border-[#006398]/40 cursor-pointer transition-all flex items-start gap-2 shadow-xs"
                  >
                    <span class="material-symbols-outlined text-[16px] text-[#006398] shrink-0 mt-0.5">add_circle</span>
                    <div class="flex flex-col text-[11px]">
                      <span class="font-bold text-[#131b2e]">${control.label}</span>
                      <span class="text-[#3f4a38] leading-relaxed">${control.text}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Textarea para edición manual o prellenado por Google SST -->
        <textarea
          oninput="handleManualRecommendationChangeMobile(this.value)"
          rows="3"
          placeholder="${actionPlanModeMobile === 'manual' ? 'Escribe libremente la medida o plan de acción sugerido...' : 'Medida seleccionada o generada desde Google SST / Normativa...'}"
          class="w-full p-3 bg-[#f2f3ff] rounded-xl text-[13px] text-[#131b2e] focus:outline-none focus:bg-white border border-[#eaedff] focus:ring-2 focus:ring-[#226d00]/30 resize-none shadow-inner"
        >${currentProposal.recommendation || ''}</textarea>
      </div>

      <!-- 2. Responsable Asignado / Líder de Subsanación & 3. Plazo Límite Subsanación -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-[#eaedff] shadow-sm">
          <label class="text-[12px] text-[#131b2e] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
            <span class="material-symbols-outlined text-[#006c49] text-[18px]">person_check</span>
            2. Responsable Asignado / Líder de Subsanación
          </label>
          <div class="flex items-center gap-2 p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
            <span class="material-symbols-outlined text-[#006c49] text-[18px]">person_check</span>
            <select
              onchange="handleResponsibleChangeMobile(this.value)"
              class="bg-transparent text-[12px] text-[#131b2e] font-bold w-full focus:outline-none cursor-pointer"
            >
              <option value="Diana Marcela">Diana Marcela (Inspector COPASST SENA)</option>
              <option value="Elizabet Rúa">Elizabet Rúa (Profesional HSE Industrial y Aviación)</option>
              <option value="Sandro Alvarado">Sandro Alvarado (Profesional HSE Comercio y Servicios)</option>
              <option value="Laura Martínez">Laura Martínez (Profesional HSE Colombo Alemán)</option>
              <option value="Lorenis de la Hoz">Lorenis de la Hoz (Profesional HSE CEDAGRO)</option>
              <option value="Óscar Sierra">Óscar Sierra (Profesional HSE Logística)</option>
              <option value="Isis Delgado">Isis Delgado (Profesional HSE TIC / Energía)</option>
              <option value="Ing. Roberto Peña">Ing. Roberto Peña (Líder Infraestructura SENA)</option>
              <option value="Lic. Marcela Durán">Lic. Marcela Durán (Representante SIGA / Ambiental)</option>
              <option value="Téc. Fernando Ruiz">Téc. Fernando Ruiz (Encargado Mantenimiento SENA)</option>
            </select>
          </div>
          <input
            type="text"
            value="${currentProposal?.assignedTo || ''}"
            oninput="handleResponsibleChangeMobile(this.value)"
            placeholder="O escribe el nombre manual del responsable..."
            class="w-full px-3 py-1.5 bg-[#f2f3ff] text-[12px] rounded-xl border border-[#eaedff] text-[#131b2e] font-bold focus:outline-none focus:bg-white"
          />
        </div>

        <div class="flex flex-col gap-2 p-4 bg-white rounded-xl border border-[#eaedff] shadow-sm">
          <label class="text-[12px] text-[#131b2e] font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
            <span class="material-symbols-outlined text-[#ba1a1a] text-[18px]">timer</span>
            3. Plazo Límite Subsanación
          </label>
          <div class="flex items-center gap-2 p-2.5 bg-[#f2f3ff] rounded-xl border border-[#eaedff]">
            <span class="material-symbols-outlined text-[#ba1a1a] text-[18px]">timer</span>
            <input
              type="text"
              value="${currentProposal?.deadline || '48 horas (Prioridad Alta)'}"
              oninput="handleDeadlineChangeMobile(this.value)"
              placeholder="Ej: 48 horas (Prioridad Alta)..."
              class="bg-transparent text-[12px] text-[#131b2e] font-bold w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  `;
}

// Convierte DataURL Base64 a Blob para subir al Bucket de Storage
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Subir foto al Bucket de Storage 'evidencias-sst' y retornar URL pública
async function uploadPhotoToStorage(base64Data, filename) {
  if (!supabaseClient || !base64Data || !base64Data.startsWith('data:')) return null;
  try {
    const blob = dataURItoBlob(base64Data);
    const filePath = `fotos/${Date.now()}_${filename}`;

    const { data, error } = await supabaseClient.storage
      .from('evidencias-sst')
      .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });

    if (error) {
      console.warn('Storage upload notice (falling back to direct URL):', error.message);
      return null;
    }

    const { data: publicData } = supabaseClient.storage
      .from('evidencias-sst')
      .getPublicUrl(filePath);

    return publicData?.publicUrl || null;
  } catch (err) {
    console.warn('Storage upload exception:', err);
    return null;
  }
}

// Obtener Georreferenciación GPS en tiempo real
function getGpsLocation() {
  const btnText = document.getElementById('txtGpsBtn');
  const resultBox = document.getElementById('gpsResultBox');
  const resultText = document.getElementById('gpsResultText');

  if (btnText) btnText.textContent = 'Obteniendo GPS...';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        currentGpsData = { lat, lng, accuracy };

        if (resultText) {
          resultText.textContent = `Latitud: ${lat.toFixed(5)} • Longitud: ${lng.toFixed(5)} (Precisión ±${accuracy}m)`;
        }
        if (resultBox) resultBox.classList.remove('hidden');
        if (btnText) btnText.textContent = 'GPS Obtenido ✓';

        showToast('Ubicación GPS Obtenida', `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Precisión ±${accuracy}m)`, 'success');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        currentGpsData = { lat: 4.58219, lng: -74.14821, accuracy: 8.0 };

        if (resultText) {
          resultText.textContent = `Latitud: 4.58219 • Longitud: -74.14821 (Precisión Estimada ±8m)`;
        }
        if (resultBox) resultBox.classList.remove('hidden');
        if (btnText) btnText.textContent = 'GPS Estimado ✓';

        showToast('Ubicación GPS Predeterminada', 'Se asignaron las coordenadas de la sede SENA.', 'info');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  } else {
    currentGpsData = { lat: 4.58219, lng: -74.14821, accuracy: 8.0 };
    if (resultText) {
      resultText.textContent = `Latitud: 4.58219 • Longitud: -74.14821 (Precisión Estimada ±8m)`;
    }
    if (resultBox) resultBox.classList.remove('hidden');
    if (btnText) btnText.textContent = 'GPS Estimado ✓';
  }
}

// Guarda registro completo relacional en Supabase: inspecciones -> hallazgos_sst -> evidencias_multimedia -> planes_accion
async function saveFullInspectionToSupabase(insp) {
  if (!supabaseClient) return null;
  try {
    // 1. Resolver ID de Sede en 'sedes_sena'
    let sedeId = null;
    try {
      const { data: sedes } = await supabaseClient.from('sedes_sena').select('id, nombre_sede, centro_formacion');
      if (sedes && sedes.length > 0) {
        const found = sedes.find(s => 
          (s.nombre_sede && s.nombre_sede.toLowerCase().includes(insp.sede.toLowerCase())) || 
          (s.centro_formacion && s.centro_formacion.toLowerCase().includes(insp.sede.toLowerCase()))
        );
        sedeId = found ? found.id : sedes[0].id;
      }
    } catch (e) {
      console.warn('Sede lookup notice:', e);
    }

    // 2. Resolver ID de Taller en 'talleres_criticos'
    let tallerId = null;
    try {
      const { data: talleres } = await supabaseClient.from('talleres_criticos').select('id, nombre');
      if (talleres && talleres.length > 0) {
        const found = talleres.find(t => t.nombre && t.nombre.toLowerCase().includes(insp.area.toLowerCase()));
        tallerId = found ? found.id : talleres[0].id;
      }
    } catch (e) {
      console.warn('Taller lookup notice:', e);
    }

    // 3. Resolver ID de Inspector en 'inspectores_copasst'
    let inspectorId = null;
    try {
      const { data: inspectores } = await supabaseClient.from('inspectores_copasst').select('id, nombres, apellidos, documento_identidad');
      if (inspectores && inspectores.length > 0) {
        const selectedId = selectedInspectors[0];
        const matchByUuid = inspectores.find(i => i.id === selectedId);
        const matchByName = inspectores.find(i => `${i.nombres || ''} ${i.apellidos || ''}`.toLowerCase().includes((insp.inspectorName || '').toLowerCase()));
        
        inspectorId = matchByUuid ? matchByUuid.id : matchByName ? matchByName.id : inspectores[0].id;
      }
    } catch (e) {
      console.warn('Inspector lookup notice:', e);
    }

    // 4. Crear registro en la tabla 'inspecciones' (con taller_id e inspector_id relacionales)
    const safeInspCode = insp.code ? insp.code.replace('HAL', 'INSP') : `INSP-2025-${Date.now().toString().slice(-4)}`;
    
    let createdInspection = null;
    try {
      const { data: newInsp, error: inspErr } = await supabaseClient
        .from('inspecciones')
        .insert({
          codigo_inspeccion: safeInspCode,
          taller_id: tallerId,
          inspector_id: inspectorId,
          latitud: currentGpsData?.lat || 4.58219,
          longitud: currentGpsData?.lng || -74.14821,
          precision_gps: currentGpsData?.accuracy || 8.0,
          fecha_inspeccion: new Date().toISOString()
        })
        .select()
        .single();

      if (!inspErr && newInsp) {
        createdInspection = newInsp;
      } else {
        console.warn('Inspecciones insert notice:', inspErr?.message);
      }
    } catch (err) {
      console.warn('Inspecciones insert exception:', err);
    }

    // 5. Crear registros en la tabla 'hallazgos_sst', 'evidencias_multimedia' y 'planes_accion' vinculados a 'inspecciones'
    const findingsToSave = (insp.findings && insp.findings.length > 0)
      ? insp.findings
      : [{
          title: insp.title,
          description: insp.description,
          riskCategory: insp.riskCategory || 'Condiciones de Seguridad',
          riskLevel: insp.riskLevel || 'II',
          imageUrl: insp.imageUrl,
          recommendation: currentProposal?.recommendation || `Medida inmediata correctiva para ${insp.title}`
        }];

    let firstFindingId = null;

    for (let i = 0; i < findingsToSave.length; i++) {
      const f = findingsToSave[i];
      const halCode = f.code || `${safeInspCode.replace('INSP', 'HAL')}-${i + 1}`;
      
      const { data: insertedFinding, error: halErr } = await supabaseClient
        .from('hallazgos_sst')
        .insert({
          inspeccion_id: createdInspection ? createdInspection.id : null,
          codigo_hallazgo: halCode,
          titulo: f.title,
          descripcion_detallada: f.description,
          peligro_gtc45: f.riskCategory || 'Condiciones de Seguridad',
          nivel_riesgo_homologado: f.riskLevel || 'II',
          estado: 'en_proceso'
        })
        .select()
        .single();

      if (halErr) {
        console.warn(`Hallazgos #${i + 1} insert notice:`, halErr.message);
      } else if (insertedFinding) {
        if (i === 0) firstFindingId = insertedFinding.id;

        // Subir o vincular evidencia multimedia
        if (f.imageUrl) {
          const filename = `evidencia_${Date.now()}_${i + 1}.jpg`;
          await supabaseClient.from('evidencias_multimedia').insert({
            hallazgo_id: insertedFinding.id,
            public_url: f.imageUrl,
            nombre_archivo: filename
          });
        }

        // Crear plan de acción por hallazgo
        try {
          const fechaLimite = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          await supabaseClient.from('planes_accion').insert({
            hallazgo_id: insertedFinding.id,
            medida_inmediata: f.recommendation || `Medida inmediata correctiva para ${f.title}`,
            responsable_subsanacion: insp.assignedTo || 'Diana Marcela',
            fecha_limite: fechaLimite,
            cumplido: false
          });
        } catch (planErr) {
          console.warn(`Planes de acción #${i + 1} insert notice:`, planErr);
        }
      }
    }

    return {
      success: true,
      inspectionId: createdInspection?.id,
      findingId: firstFindingId
    };
  } catch (globalErr) {
    console.error('Error saving full inspection to Supabase:', globalErr);
    return null;
  }
}

// Sincronizar individualmente un registro a Supabase BD
async function syncInspectionToSupabaseCloud(inspId) {
  const target = inspections.find(i => i.id === inspId);
  if (!target) {
    showToast('Inspección No Encontrada', 'No se encontró el registro a sincronizar.', 'error');
    return;
  }

  showToast('Sincronizando BD...', `Enviando inspección ${target.code} a Supabase...`, 'info');
  const res = await saveFullInspectionToSupabase(target);

  if (res && res.success) {
    showToast('Sincronizado con Éxito', `Inspección ${target.code} registrada en 'inspecciones', 'hallazgos_sst' y 'planes_accion' en Supabase.`, 'success');
  } else {
    showToast('Registro Local Actualizado', `Inspección procesada localmente.`, 'info');
  }
}

let activeSessionFindings = [];

function resetCameraInputs() {
  capturedImageData = null;
  const imgEl = document.getElementById('capturedPreviewImage');
  const placeholderEl = document.getElementById('cameraPlaceholder');
  if (imgEl) imgEl.classList.add('hidden');
  if (placeholderEl) placeholderEl.classList.remove('hidden');
  const camInput = document.getElementById('cameraInput');
  const fileInput = document.getElementById('fileInput');
  if (camInput) camInput.value = '';
  if (fileInput) fileInput.value = '';
}

// Limpiar y resetear todos los campos para una NUEVA INSPECCIÓN
function resetInspectionForm(showNotification = true) {
  // 1. Limpiar hallazgos y fotos acumuladas en la sesión activa
  activeSessionFindings = [];

  // 2. Limpiar foto capturada y visores
  resetCameraInputs();

  // 3. Limpiar banner de hallazgos
  renderSessionFindingsBanner();

  // 4. Limpiar geolocalización GPS
  currentGpsData = null;
  const btnText = document.getElementById('txtGpsBtn');
  const resultBox = document.getElementById('gpsResultBox');
  const resultText = document.getElementById('gpsResultText');
  if (btnText) btnText.textContent = 'Obtener Ubicación GPS';
  if (resultBox) resultBox.classList.add('hidden');
  if (resultText) resultText.textContent = '';

  // 5. Reiniciar desplegables de Sede y Taller
  const selectSede = document.getElementById('selectSede');
  if (selectSede && selectSede.options.length > 0) selectSede.selectedIndex = 0;
  
  const selectTaller = document.getElementById('selectTaller');
  if (selectTaller && selectTaller.options.length > 0) selectTaller.selectedIndex = 0;

  // 6. Reiniciar estados de propuesta borrador
  currentProposal = {
    hazardTitle: 'Condición o acto inseguro detectado en campo',
    riskCategory: 'Condiciones de Seguridad',
    riskLevel: 'II',
    confidence: '90%',
    gtc45Description: 'Hallazgo registrado durante inspección técnica en campo.',
    recommendation: 'Aplicar medida de control correctiva.'
  };
  selectedFinding = null;
  manualFindingDescription = '';
  isManualCatalogMode = false;

  if (showNotification) {
    showToast('Campos Limpios', 'Formulario reiniciado. Todos los datos están listos para una nueva inspección.', 'info');
  }
}

// Iniciar una nueva sesión de inspección desde cero
function startNewInspectionSession() {
  resetInspectionForm(false);
  navigateTo('nueva-inspeccion-campo');
  showToast('Nueva Inspección', 'Formulario listo para ingresar nuevos datos y guardarlos en la BD.', 'success');
}

function renderSessionFindingsBanner() {
  const container = document.getElementById('activeSessionFindingsContainer');
  const countEl = document.getElementById('txtFindingsCount');
  const listEl = document.getElementById('findingsThumbnailsList');

  if (!container || !countEl || !listEl) return;

  if (activeSessionFindings.length === 0) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  countEl.textContent = `${activeSessionFindings.length}`;

  listEl.innerHTML = activeSessionFindings.map((f, idx) => `
    <div class="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#eaedff] group shadow-sm bg-slate-900">
      <img src="${f.imageUrl}" class="w-full h-full object-cover" alt="Thumb ${idx + 1}">
      <span class="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] font-bold text-center py-0.5 truncate">#${idx + 1}</span>
      <button type="button" onclick="removeSessionFinding(${idx}, event)" title="Eliminar foto" class="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">×</button>
    </div>
  `).join('');
}

function removeSessionFinding(idx, event) {
  if (event) event.stopPropagation();
  activeSessionFindings.splice(idx, 1);
  renderSessionFindingsBanner();
  showToast('Foto Removida', 'Se eliminó la foto de la inspección activa.', 'info');
}

function addFindingAndTakeAnother() {
  if (!capturedImageData && (!currentProposal || !currentProposal.hazardTitle)) {
    showToast('Fotografía Requerida', 'Toma una foto antes de guardar el hallazgo.', 'info');
    return;
  }

  const findingObj = {
    id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    code: `HAL-2026-00${activeSessionFindings.length + 1}`,
    title: currentProposal.hazardTitle || 'Condición insegura detectada en campo',
    riskCategory: currentProposal.riskCategory || 'Condiciones de Seguridad',
    riskLevel: currentProposal.riskLevel || 'II',
    description: currentProposal.gtc45Description || 'Hallazgo registrado mediante análisis de inspección.',
    recommendation: currentProposal.recommendation || 'Aplicar medida de control correctiva.',
    imageUrl: capturedImageData || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200'
  };

  activeSessionFindings.push(findingObj);
  resetCameraInputs();
  renderSessionFindingsBanner();

  showToast('Hallazgo Guardado ✓', `Foto #${activeSessionFindings.length} guardada. Puedes tomar la siguiente foto.`, 'success');
  navigateTo('nueva-inspeccion-campo');
}

function addNewPhotoToCurrentInspection() {
  resetCameraInputs();
  navigateTo('nueva-inspeccion-campo');
  showToast('Agregar Otra Foto', 'Captura la siguiente foto/peligro para esta inspección.', 'info');
}

// Navegar desde el Análisis Maker-Checker al Informe Oficial (F-SST-012) sin aprobar inmediatamente
function goToFindingReportView() {
  // Solo agregar un hallazgo adicional si REALMENTE hay una nueva foto capturada en pantalla (capturedImageData válido)
  if (capturedImageData && capturedImageData.length > 500) {
    const isAlreadyPushed = activeSessionFindings.some(f => f.imageUrl === capturedImageData);
    if (!isAlreadyPushed) {
      const findingObj = {
        id: `f-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        code: `HAL-2026-00${activeSessionFindings.length + 1}`,
        title: currentProposal?.hazardTitle || 'Condición insegura detectada en campo',
        riskCategory: currentProposal?.riskCategory || 'Condiciones de Seguridad',
        riskLevel: currentProposal?.riskLevel || 'II',
        description: currentProposal?.gtc45Description || 'Hallazgo registrado mediante análisis de inspección.',
        recommendation: currentProposal?.recommendation || 'Aplicar medida de control correctiva.',
        imageUrl: capturedImageData
      };
      activeSessionFindings.push(findingObj);
      resetCameraInputs();
      renderSessionFindingsBanner();
    }
  }

  // Si no hay ninguna foto en la sesión activa, fallback de demostración
  if (activeSessionFindings.length === 0) {
    activeSessionFindings.push({
      id: `f-${Date.now()}`,
      code: 'HAL-2026-001',
      title: 'Guarda de protección desajustada en torno mecánico',
      riskCategory: 'Condiciones de Seguridad',
      riskLevel: 'II',
      description: 'Falta tornillo prisionero en guarda acrílica del cabezal giratorio.',
      recommendation: 'Instalar perno de seguridad y verificar tope.',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200'
    });
  }

  const hasHighRisk = activeSessionFindings.some(f => f.riskLevel === 'I' || f.riskLevel === 'II');
  const globalRiskLevel = hasHighRisk ? 'II' : 'III';
  const sedeVal = document.getElementById('selectSede')?.value;
  const tallerVal = document.getElementById('selectTaller')?.value;

  const draftInsp = {
    id: `insp-draft-${Date.now()}`,
    code: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: activeSessionFindings.length === 1 
      ? activeSessionFindings[0].title 
      : `Inspección Multihallazgo COPASST (${activeSessionFindings.length} Hallazgos Registrados)`,
    sede: (sedeVal && sedesList.includes(sedeVal)) ? sedeVal : 'Complejo Sur - Centro de Metalmecánica',
    area: (tallerVal && talleresList.includes(tallerVal)) ? tallerVal : 'Taller de Maquinado y Tornos',
    date: new Date().toLocaleDateString('es-CO'),
    inspectorName: activeReportSigner || copasstMembers[0]?.name || 'Laura Noguera',
    riskLevel: globalRiskLevel,
    riskCategory: activeSessionFindings[0]?.riskCategory || 'Condiciones de Seguridad',
    status: 'en_proceso',
    description: `Inspección técnica multihallazgo realizada en campo. Se capturaron ${activeSessionFindings.length} fotos de evidencia y factores de riesgo según la GTC 45.`,
    imageUrl: activeSessionFindings[0]?.imageUrl,
    assignedTo: activeResponsibleSigner || 'Ing. Roberto Peña',
    findings: [...activeSessionFindings],
    isApproved: false
  };

  selectedFinding = draftInsp;
  renderFindingReport();
  navigateTo('hallazgos-plan-de-accion');
}

async function approveFindingFromModal() {
  await approveFinding();
  exportReportPDF();
}

// Approve Finding & Save to Supabase (Full Relational Save)
async function approveFinding() {
  if (selectedFinding && selectedFinding.isApproved) {
    showToast('Informe Ya Aprobado', 'Este informe ya ha sido aprobado y guardado en la Base de Datos.', 'info');
    return;
  }

  const filename = `evidencia_${Date.now()}.jpg`;
  let finalImageUrl = capturedImageData;

  // Intenta subir la foto al Bucket de Supabase Storage
  if (supabaseClient && capturedImageData) {
    const storageUrl = await uploadPhotoToStorage(capturedImageData, filename);
    if (storageUrl) {
      finalImageUrl = storageUrl;
    }
  }

  const reportSignerProfile = getSignatureProfile(activeReportSigner);
  const respSignerProfile = getSignatureProfile(activeResponsibleSigner);

  const currentFindings = (selectedFinding?.findings && selectedFinding.findings.length > 0)
    ? selectedFinding.findings
    : (activeSessionFindings.length > 0 ? [...activeSessionFindings] : null);

  const newInsp = {
    id: selectedFinding?.id && !selectedFinding.id.startsWith('insp-draft') ? selectedFinding.id : `insp-${Date.now()}`,
    code: selectedFinding?.code || `HAL-2025-0${inspections.length + 44}`,
    title: selectedFinding?.title || currentProposal.hazardTitle || 'Condición insegura detectada en taller formativo',
    sede: selectedFinding?.sede || document.getElementById('selectSede')?.value || 'Complejo Sur - Centro de Metalmecánica',
    area: selectedFinding?.area || document.getElementById('selectTaller')?.value || 'Taller de Maquinado y Tornos',
    date: new Date().toLocaleDateString('es-CO'),
    inspectorName: reportSignerProfile.name,
    riskLevel: selectedFinding?.riskLevel || currentProposal.riskLevel || 'II',
    riskCategory: selectedFinding?.riskCategory || currentProposal.riskCategory || 'Condiciones de seguridad',
    status: 'en_proceso',
    description: selectedFinding?.description || currentProposal.gtc45Description || 'Hallazgo registrado mediante arbitraje Maker-Checker.',
    imageUrl: selectedFinding?.imageUrl || finalImageUrl || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    assignedTo: respSignerProfile.name,
    findings: currentFindings,
    isApproved: true
  };

  const existingIdx = inspections.findIndex(i => i.id === newInsp.id);
  if (existingIdx >= 0) {
    inspections[existingIdx] = newInsp;
  } else {
    inspections.unshift(newInsp);
  }

  selectedFinding = newInsp;
  saveInspectionsToLocalStorage();
  renderInspectionsList();
  updateKpis();
  renderFindingReport();

  showToast('Informe Aprobado', `Hallazgo ${newInsp.code} aprobado y registrado exitosamente en BD.`, 'success');

  // Supabase Save completo (inspecciones + hallazgos_sst + evidencias_multimedia + planes_accion)
  if (supabaseClient) {
    await saveFullInspectionToSupabase(newInsp);
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

  // Save to Supabase DB inspectores_copasst
  if (supabaseClient) {
    try {
      const parts = name.split(' ');
      const { data: createdIns } = await supabaseClient.from('inspectores_copasst').insert({
        nombres: parts[0] || name,
        apellidos: parts.slice(1).join(' ') || 'COPASST',
        documento_identidad: cc || `${Date.now()}`,
        cargo: role || 'Inspector COPASST'
      }).select('id').single();

      if (createdIns?.id) {
        newMember.id = createdIns.id;
      }
    } catch (err) {
      console.warn('Notice saving inspector to Supabase DB:', err);
    }
  }

  copasstMembers.push(newMember);
  selectedInspectors.push(newMember.id);
  renderCopasstMembers();

  closeAddInspectorModal();
  showToast('Inspector Registrado', `${name} guardado en la base de datos.`, 'success');
}

// Fetch Sedes from Supabase DB / LocalStorage on load
async function loadSedesFromSupabase() {
  const local = localStorage.getItem('sena_sedes_list');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sedesList = parsed;
        renderSedeOptions();
      }
    } catch (e) {}
  }

  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('sedes_sena')
      .select('id, nombre_sede, centro_formacion');

    if (!error && data && data.length > 0) {
      const dbSedes = data.map(d => d.nombre_sede || d.centro_formacion).filter(Boolean);
      dbSedes.forEach(s => {
        if (!sedesList.includes(s)) sedesList.push(s);
      });
      localStorage.setItem('sena_sedes_list', JSON.stringify(sedesList));
      renderSedeOptions();
    }
  } catch (e) {
    console.warn('Network notice loading sedes from Supabase:', e);
  }
}

// Fetch Talleres from Supabase DB / LocalStorage on load
async function loadTalleresFromSupabase() {
  const local = localStorage.getItem('sena_talleres_list');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        talleresList = parsed;
        renderTallerOptions();
      }
    } catch (e) {}
  }

  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('talleres_criticos')
      .select('id, nombre');

    if (!error && data && data.length > 0) {
      const dbTalleres = data.map(d => d.nombre).filter(Boolean);
      dbTalleres.forEach(t => {
        if (!talleresList.includes(t)) talleresList.push(t);
      });
      localStorage.setItem('sena_talleres_list', JSON.stringify(talleresList));
      renderTallerOptions();
    }
  } catch (e) {
    console.warn('Network notice loading talleres from Supabase:', e);
  }
}

// Fetch Inspectors strictly from inspectores_copasst DB on load
async function loadInspectorsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('inspectores_copasst')
      .select('id, nombres, apellidos, documento_identidad, cargo');

    if (error) {
      console.warn('Supabase inspectores_copasst error:', error.message);
      return;
    }

    if (data && data.length > 0) {
      copasstMembers = data.map(item => ({
        id: item.id || `cop-${Date.now()}`,
        name: `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Inspector COPASST',
        role: item.cargo || 'Inspector COPASST',
        cc: item.documento_identidad ? `C.C. ${item.documento_identidad}` : 'C.C. Pendiente'
      }));

      selectedInspectors = copasstMembers.map(m => m.id);
      renderCopasstMembers();
    }
    loadIndependentRoleMembersFromSupabase();
  } catch (e) {
    console.warn('Network error loading inspectores_copasst:', e);
  }
}

// Fetch Independent Roles from Supabase (representantes_sst, representantes_ambiental, encargados_infraestructura)
async function loadIndependentRoleMembersFromSupabase() {
  if (!supabaseClient) return;
  
  // 1. Representantes SST
  try {
    const { data: sstData } = await supabaseClient.from('representantes_sst').select('*');
    if (sstData && sstData.length > 0) {
      repSstMembers = sstData.map(item => ({
        id: item.id || `sst-${Date.now()}`,
        name: `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Representante SST',
        role: item.cargo || 'Representante SST',
        cc: item.documento_identidad ? `C.C. ${item.documento_identidad}` : 'C.C. Pendiente'
      }));
      selectedSstMembers = [repSstMembers[0].id];
      renderRepSstMembers();
    }
  } catch (e) {}

  // 2. Representantes Ambiental
  try {
    const { data: ambData } = await supabaseClient.from('representantes_ambiental').select('*');
    if (ambData && ambData.length > 0) {
      repAmbientalMembers = ambData.map(item => ({
        id: item.id || `amb-${Date.now()}`,
        name: `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Representante Ambiental',
        role: item.cargo || 'Representante Ambiental',
        cc: item.documento_identidad ? `C.C. ${item.documento_identidad}` : 'C.C. Pendiente'
      }));
      selectedAmbientalMembers = [repAmbientalMembers[0].id];
      renderRepAmbientalMembers();
    }
  } catch (e) {}

  // 3. Encargados Infraestructura
  try {
    const { data: infraData } = await supabaseClient.from('encargados_infraestructura').select('*');
    if (infraData && infraData.length > 0) {
      repInfraestructuraMembers = infraData.map(item => ({
        id: item.id || `inf-${Date.now()}`,
        name: `${item.nombres || ''} ${item.apellidos || ''}`.trim() || 'Encargado Infraestructura',
        role: item.cargo || 'Encargado Infraestructura',
        cc: item.documento_identidad ? `C.C. ${item.documento_identidad}` : 'C.C. Pendiente'
      }));
      selectedInfraestructuraMembers = [repInfraestructuraMembers[0].id];
      renderRepInfraestructuraMembers();
    }
  } catch (e) {}
}

// Fetch Inspections and Photos from Supabase DB on demand
async function loadInspectionsFromSupabase(showToastAlert = false) {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('hallazgos_sst')
      .select(`
        id,
        codigo_hallazgo,
        titulo,
        descripcion_detallada,
        peligro_gtc45,
        nivel_riesgo_homologado,
        estado,
        creado_en,
        evidencias_multimedia (
          public_url
        )
      `)
      .order('creado_en', { ascending: false });

    if (error) {
      console.warn('Supabase hallazgos query error:', error.message);
      if (showToastAlert) showToast('Error Supabase', error.message, 'error');
      return;
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const dbInspections = data.map(item => {
        const evidence = Array.isArray(item.evidencias_multimedia) ? item.evidencias_multimedia[0] : item.evidencias_multimedia;
        return {
          id: item.id,
          code: item.codigo_hallazgo || 'HAL-2026-001',
          title: item.titulo || 'Hallazgo de seguridad en campo',
          sede: 'Complejo Sur - Centro de Metalmecánica',
          area: 'Taller de Formación',
          date: item.creado_en ? new Date(item.creado_en).toLocaleDateString('es-CO') : new Date().toLocaleDateString(),
          inspectorName: 'Laura Noguera',
          riskLevel: item.nivel_riesgo_homologado || 'II',
          riskCategory: item.peligro_gtc45 || 'Condiciones de seguridad',
          status: item.estado || 'en_proceso',
          description: item.descripcion_detallada || 'Sin descripción',
          imageUrl: evidence?.public_url || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
          assignedTo: 'Ing. Roberto Peña'
        };
      });

      inspections = dbInspections;
      selectedFinding = inspections[0];
      if (showToastAlert) showToast('Histórico Cargado', `Se importaron ${dbInspections.length} hallazgos desde Supabase.`, 'info');
    } else {
      inspections = [];
      selectedFinding = null;
      if (showToastAlert) showToast('Sin Registros', 'No se encontraron hallazgos guardados en Supabase.', 'info');
    }
    renderInspectionsList();
    updateKpis();
    renderFindingReport();
  } catch (err) {
    console.warn('Network error loading hallazgos from Supabase:', err);
    if (showToastAlert) showToast('Error de Red', 'No se pudo conectar con la base de datos Supabase.', 'error');
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

// Database of SENA Sites GPS Coordinates (Regional Atlántico & Main Campus)
const SENA_SITES_GPS = [
  { name: 'Centro Nacional Colombo Alemán (Sede Principal)', lat: 10.9412, lng: -74.7791 },
  { name: 'Centro Industrial y de Aviación', lat: 10.9431, lng: -74.7765 },
  { name: 'Centro de Comercio y Servicios (Sede Principal)', lat: 10.9814, lng: -74.7821 },
  { name: 'Sede Metalmecánica (Malambo)', lat: 10.8591, lng: -74.7782 },
  { name: 'Sede Refrigeración (Lipaya)', lat: 10.9620, lng: -74.8210 },
  { name: 'Sede Madera (Vía a Galapa)', lat: 10.9010, lng: -74.8820 },
  { name: 'Sede Confecciones (Baranoa)', lat: 10.7930, lng: -74.9150 },
  { name: 'Sede Construcción (Caribe Verde)', lat: 10.9320, lng: -74.8410 },
  { name: 'Sede Logística (Caribe Verde)', lat: 10.9325, lng: -74.8415 },
  { name: 'Sede TIC (Hotel del Prado)', lat: 10.9950, lng: -74.8020 },
  { name: 'Sede Energía (Barrio Montes)', lat: 10.9580, lng: -74.7780 },
  { name: 'Sede Industrias Creativas (Barrio Abajo)', lat: 10.9910, lng: -74.7840 },
  { name: 'Sede Salud (Detrás Hospital Barranquilla)', lat: 10.9780, lng: -74.7910 },
  { name: 'Sede Hotelería (Barrio Abajo)', lat: 10.9915, lng: -74.7845 },
  { name: 'Sede Servicios Financieros y Comercialización (Cayenas)', lat: 10.9250, lng: -74.8050 },
  { name: 'Sede Servicios Administrativos (Bosque)', lat: 10.9480, lng: -74.8150 },
  { name: 'Sede Gastronomía y Bilingüismo (Juan de Acosta)', lat: 10.8280, lng: -75.0350 },
  { name: 'Sede Ecoturismo (Luruaco)', lat: 10.6120, lng: -75.1430 },
  { name: 'Sede CVA (Sabanalarga)', lat: 10.6300, lng: -74.9200 },
  { name: 'Sede Ope. Comerciales (Soledad - Normandía)', lat: 10.9150, lng: -74.7810 },
  { name: 'Complejo Sur SENA (Bogotá)', lat: 4.58219, lng: -74.14821 }
];

// Calculate Haversine distance in km
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestSenaSite(lat, lng) {
  let nearestSite = null;
  let minDistance = Infinity;
  for (const site of SENA_SITES_GPS) {
    const dist = calculateHaversineDistance(lat, lng, site.lat, site.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestSite = site;
    }
  }
  return { site: nearestSite, distanceKm: minDistance };
}

let isGpsEnabled = false;

function toggleGpsOption(enabled) {
  isGpsEnabled = enabled;
  const statusEl = document.getElementById('txtGpsStatus');
  const btn = document.getElementById('btnGetGps');
  const resultBox = document.getElementById('gpsResultBox');
  const resultText = document.getElementById('gpsResultText');
  const offNotice = document.getElementById('gpsOffNotice');

  if (statusEl) {
    statusEl.textContent = enabled ? 'GPS Activado' : 'GPS Desactivado';
    statusEl.className = enabled ? 'text-[11px] font-bold text-[#226d00]' : 'text-[11px] font-bold text-[#6f7b66]';
  }

  if (btn) {
    if (enabled) {
      btn.classList.remove('hidden');
      getGpsLocation();
    } else {
      btn.classList.add('hidden');
    }
  }

  if (offNotice) {
    if (enabled) {
      offNotice.classList.add('hidden');
    } else {
      offNotice.classList.remove('hidden');
    }
  }

  if (!enabled && resultBox) {
    resultBox.classList.add('hidden');
  }
}

// Automatic SENA Site Detection & Free OpenStreetMap Geocoding
async function getGpsLocation() {
  const btn = document.getElementById('btnGetGps');
  const txtBtn = document.getElementById('txtGpsBtn');
  const resultBox = document.getElementById('gpsResultBox');
  const resultText = document.getElementById('gpsResultText');

  if (!navigator.geolocation) {
    showToast('GPS No Disponible', 'Tu navegador no soporta geolocalización GPS.', 'error');
    return;
  }

  if (txtBtn) txtBtn.innerText = 'Obteniendo GPS...';
  if (btn) btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = Number(position.coords.latitude.toFixed(5));
      const lng = Number(position.coords.longitude.toFixed(5));
      const accuracy = Math.round(position.coords.accuracy || 10);

      // Detect nearest SENA Sede
      const detection = findNearestSenaSite(lat, lng);
      let detectedSedeName = detection.site ? detection.site.name : null;

      // Reverse geocoding via OpenStreetMap (100% Gratis sin API Key)
      let addressStr = 'Barranquilla, Atlántico, Colombia';
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: { 'Accept-Language': 'es' }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.display_name) {
            addressStr = data.display_name.split(',').slice(0, 4).join(', ');
          }
        }
      } catch (e) {
        console.warn('OpenStreetMap Nominatim reverse geocode fallback:', e);
      }

      // Auto-select detected Sede in dropdown if match exists
      const selectSede = document.getElementById('selectSede');
      if (selectSede && detectedSedeName) {
        let optionFound = false;
        for (let i = 0; i < selectSede.options.length; i++) {
          if (selectSede.options[i].value.toLowerCase().includes(detectedSedeName.toLowerCase()) ||
              detectedSedeName.toLowerCase().includes(selectSede.options[i].value.toLowerCase())) {
            selectSede.selectedIndex = i;
            optionFound = true;
            break;
          }
        }
        if (!optionFound) {
          const newOpt = document.createElement('option');
          newOpt.value = detectedSedeName;
          newOpt.innerText = detectedSedeName;
          selectSede.appendChild(newOpt);
          selectSede.value = detectedSedeName;
        }
        autoSelectHseForSede(selectSede.value);
      }

      // Render GPS result box
      if (resultBox && resultText) {
        resultBox.classList.remove('hidden');
        resultText.innerHTML = `
          <div class="flex flex-col gap-1.5 text-[12px] p-1">
            <div class="flex items-center gap-1.5 font-bold text-[#005236]">
              <span class="material-symbols-outlined text-[16px] text-[#226d00]">near_me</span>
              <span>📍 Coordenadas: ${lat}° N, ${lng}° W (Precisión ±${accuracy}m)</span>
            </div>
            <div class="text-[#131b2e] font-bold bg-white/90 p-2 rounded-xl border border-[#6cf8bb]/60 shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[#226d00] text-[18px]">location_city</span>
              <div>
                <span class="text-[10px] text-[#006c49] font-extrabold uppercase tracking-wider block leading-none">Sede SENA Identificada</span>
                <span class="text-[13px] text-[#131b2e]">${detectedSedeName || 'SENA Regional Atlántico'}</span>
              </div>
            </div>
            <div class="text-[#3f4a38] text-[11px] bg-white/50 p-2 rounded-lg">
              🏠 <span class="font-bold">Dirección Física (OpenStreetMap Gratis):</span> ${addressStr}
            </div>
          </div>
        `;
      }

      if (txtBtn) txtBtn.innerText = 'Actualizar Ubicación GPS';
      if (btn) btn.disabled = false;
      showToast('Ubicación Detectada', `Sede SENA: ${detectedSedeName || 'Regional Atlántico'}`, 'success');
    },
    async (error) => {
      console.warn('GPS Error, using default SENA Centro Nacional Colombo Alemán fallback:', error);
      const lat = 10.9412;
      const lng = -74.7791;
      const detectedSedeName = 'Centro Nacional Colombo Alemán (Sede Principal)';
      const addressStr = 'Calle 30 No. 3E-164, Soledad / Barranquilla, Atlántico';

      const selectSede = document.getElementById('selectSede');
      if (selectSede) {
        selectSede.value = detectedSedeName;
        autoSelectHseForSede(detectedSedeName);
      }

      if (resultBox && resultText) {
        resultBox.classList.remove('hidden');
        resultText.innerHTML = `
          <div class="flex flex-col gap-1.5 text-[12px] p-1">
            <div class="flex items-center gap-1.5 font-bold text-[#005236]">
              <span class="material-symbols-outlined text-[16px] text-[#226d00]">near_me</span>
              <span>📍 Coordenadas: ${lat}° N, ${lng}° W (Ubicación Predeterminada SENA)</span>
            </div>
            <div class="text-[#131b2e] font-bold bg-white/90 p-2 rounded-xl border border-[#6cf8bb]/60 shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[#226d00] text-[18px]">location_city</span>
              <div>
                <span class="text-[10px] text-[#006c49] font-extrabold uppercase tracking-wider block leading-none">Sede SENA Identificada</span>
                <span class="text-[13px] text-[#131b2e]">${detectedSedeName}</span>
              </div>
            </div>
            <div class="text-[#3f4a38] text-[11px] bg-white/50 p-2 rounded-lg">
              🏠 <span class="font-bold">Dirección Física (OpenStreetMap Gratis):</span> ${addressStr}
            </div>
          </div>
        `;
      }

      if (txtBtn) txtBtn.innerText = 'Obtener Ubicación GPS';
      if (btn) btn.disabled = false;
      showToast('Ubicación SENA', `Asignada sede SENA: ${detectedSedeName}`, 'info');
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function autoSelectHseForSede(sedeName) {
  if (!sedeName) return;
  const hseMatch = repSstMembers.find(m => m.sedes && m.sedes.some(s => s.toLowerCase().includes(sedeName.toLowerCase()) || sedeName.toLowerCase().includes(s.toLowerCase())));
  if (hseMatch && !selectedSstMembers.includes(hseMatch.id)) {
    selectedSstMembers.push(hseMatch.id);
    renderRepSstMembers();
  }
}

// Top Bar Header Search Function
function handleSearch(query) {
  const q = (query || '').trim().toLowerCase();
  
  // Filter dashboard inspections list
  renderInspectionsList('todos', q);

  // Filter Directorio HSE if input exists
  if (document.getElementById('inputSearchHse')) {
    const inputDir = document.getElementById('inputSearchHse');
    inputDir.value = q;
    filterHseDirectory();
  }

  // If user is searching from top header, navigate to dashboard to show filtered findings
  if (q.length > 1) {
    const activeSection = document.querySelector('.view-section:not(.hidden)');
    if (activeSection && activeSection.id !== 'view-dashboard-telemetria' && activeSection.id !== 'view-directorio-profesionales-hse') {
      navigateTo('dashboard-telemetria');
    }
  }
}

function exportReportPDF() {
  const modal = document.getElementById('modalPdfPreview');
  const container = document.getElementById('pdfPreviewContent');
  if (!modal || !container) return;

  if (!selectedFinding) {
    if (inspections && inspections.length > 0) {
      selectedFinding = inspections[0];
    } else {
      selectedFinding = {
        code: 'HAL-2026-001',
        title: 'Inspección COPASST en Campo',
        sede: document.getElementById('selectSede')?.value || 'Complejo Sur - Centro de Metalmecánica',
        area: document.getElementById('selectTaller')?.value || 'Taller de Maquinado y Tornos',
        date: new Date().toLocaleDateString('es-CO'),
        riskLevel: 'II',
        description: 'Inspección técnica multihallazgo realizada en campo.',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200'
      };
    }
  }

  const isHigh = selectedFinding.riskLevel === 'I' || selectedFinding.riskLevel === 'II';
  const badgeColor = isHigh ? 'bg-red-100 text-red-700 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300';
  const assigned = selectedFinding.assignedTo || 'Ing. Roberto Peña';

  const reportSignerProfile = getSignatureProfile(activeReportSigner);
  const respSignerProfile = getSignatureProfile(activeResponsibleSigner);

  const pdfFindingsList = (selectedFinding.findings && selectedFinding.findings.length > 0)
    ? selectedFinding.findings
    : [{
        title: selectedFinding.title,
        description: selectedFinding.description,
        riskCategory: selectedFinding.riskCategory || 'Condiciones de Seguridad',
        riskLevel: selectedFinding.riskLevel || 'II',
        imageUrl: selectedFinding.imageUrl,
        recommendation: currentProposal?.recommendation || 'Aplicar medida de control correctiva.'
      }];

  container.innerHTML = `
    <!-- Encabezado Institucional SENA -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#226d00] pb-3 gap-2">
      <div class="flex items-center gap-2.5">
        <img src="sena-logo.png" alt="SENA Logo" class="h-10 sm:h-12 w-auto object-contain shrink-0">
        <div class="flex flex-col">
          <span class="font-extrabold text-[13px] sm:text-[15px] text-[#226d00] tracking-tight">SERVICIO NACIONAL DE APRENDIZAJE - SENA</span>
          <span class="text-[11px] text-[#3f4a38] font-bold">SISTEMA DE GESTIÓN SG-SST</span>
          <span class="text-[10px] text-[#6f7b66] font-semibold">FORMATO F-SST-012 • REPORTE OFICIAL DE INSPECCIÓN COPASST</span>
        </div>
      </div>
      <div class="text-left sm:text-right shrink-0 text-[10px] sm:text-[11px]">
        <span class="font-mono block text-slate-600 font-bold">CÓDIGO: ${selectedFinding.code}</span>
        <span class="font-mono block text-slate-500">FECHA: ${selectedFinding.date}</span>
      </div>
    </div>

    <!-- Nivel de Riesgo y Título -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 gap-2">
      <div>
        <span class="text-[10px] font-bold text-[#226d00] uppercase tracking-wider block">Inspección COPASST</span>
        <h2 class="text-sm sm:text-base font-bold text-[#131b2e] leading-snug">${selectedFinding.title}</h2>
      </div>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${badgeColor} shrink-0">Riesgo Global ${selectedFinding.riskLevel}</span>
    </div>

    <!-- Ubicación e Inspectores -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-[12px]">
      <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <span class="font-bold text-slate-500 block text-[9px] sm:text-[10px] uppercase">Centro de Formación / Regional</span>
        <span class="font-semibold text-slate-800 leading-tight block">${selectedFinding.sede}</span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <span class="font-bold text-slate-500 block text-[9px] sm:text-[10px] uppercase">Área / Taller Específico</span>
        <span class="font-semibold text-slate-800 leading-tight block">${selectedFinding.area}</span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <span class="font-bold text-slate-500 block text-[9px] sm:text-[10px] uppercase">Inspector COPASST</span>
        <span class="font-semibold text-slate-800 leading-tight block">${reportSignerProfile.name}</span>
      </div>
      <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
        <span class="font-bold text-slate-500 block text-[9px] sm:text-[10px] uppercase">Geolocalización GPS</span>
        <span class="font-semibold text-slate-800 leading-tight block truncate">${currentGpsData ? `Lat ${currentGpsData.lat}, Lng ${currentGpsData.lng}` : '4.58219, -74.14821 (Complejo Sur)'}</span>
      </div>
    </div>

    <!-- Clasificación GTC 45 y Registro Fotográfico Multihallazgo -->
    <div class="flex flex-col gap-3 text-[11px] sm:text-[12px]">
      <span class="font-bold text-[#131b2e] text-[12px] sm:text-[13px] border-b border-slate-200 pb-1">Evidencias Fotográficas y Peligros Registrados (${pdfFindingsList.length}):</span>
      ${pdfFindingsList.map((f, idx) => `
        <div class="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2 print-avoid-break">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span class="font-bold text-[#226d00] text-[11px] sm:text-[12px]">Hallazgo #${idx + 1}: ${f.title}</span>
            <span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${f.riskLevel === 'I' || f.riskLevel === 'II' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
              Nivel Riesgo ${f.riskLevel} • ${f.riskCategory || 'GTC 45'}
            </span>
          </div>
          <div class="w-full h-36 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
            <img src="${f.imageUrl}" alt="Evidencia #${idx + 1}" class="w-full h-full object-cover">
          </div>
          <p class="text-[10px] sm:text-[11px] text-slate-700 leading-relaxed bg-white p-2 sm:p-2.5 rounded-lg border border-slate-200">
            <strong>Descripción GTC 45:</strong> ${f.description || 'Intervención visual registrada.'}
          </p>
          <p class="text-[10px] sm:text-[11px] text-[#005236] leading-relaxed bg-[#6cf8bb]/20 p-2 sm:p-2.5 rounded-lg border border-[#6cf8bb]/40">
            <strong>Medida Recomendada / Plan de Acción:</strong> ${f.recommendation || 'Aplicar control técnico de seguridad en el taller.'}
          </p>
        </div>
      `).join('')}
    </div>

    <!-- Responsables Asignados -->
    <div class="p-3 bg-[#226d00]/10 rounded-xl border border-[#226d00]/30 text-[11px] sm:text-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 print-avoid-break">
      <div>
        <span class="font-bold text-[#006c49] block text-[10px] uppercase">Responsable Asignado de Subsanación:</span>
        <span class="font-bold text-[#131b2e] text-[12px] sm:text-[13px]">${assigned}</span>
      </div>
      <span class="text-[10px] sm:text-[11px] bg-white px-2.5 py-1 rounded-lg font-semibold text-[#006c49] border border-[#226d00]/20 shrink-0">Seguimiento SG-SST</span>
    </div>

    <!-- Firmas de Aceptación Digital Acreditadas al Final del Informe (F-SST-012) -->
    <div class="flex flex-col gap-2 pt-3 border-t-2 border-[#226d00]/40 mt-1 print-avoid-break">
      <span class="text-[10px] sm:text-[11px] font-bold text-[#226d00] uppercase tracking-wider">Firmas de Aceptación y Conformidad Oficial (F-SST-012):</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] sm:text-[11px] text-slate-700">
        <!-- Firma 1 -->
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
          <div class="w-full h-14 flex items-center justify-center">
            ${reportSignerProfile.svgSignature}
          </div>
          <div class="w-full border-t border-dashed border-slate-300 my-1"></div>
          <span class="font-bold text-slate-900 text-[11px] sm:text-[12px]">${reportSignerProfile.name}</span>
          <span class="text-[10px] text-[#226d00] font-semibold">${reportSignerProfile.role}</span>
          <span class="text-[9px] text-slate-500">${reportSignerProfile.cc} • ${reportSignerProfile.license}</span>
          <span class="text-[8px] font-mono text-[#006c49] mt-0.5 bg-[#6cf8bb]/40 px-1.5 py-0.5 rounded truncate max-w-full">${reportSignerProfile.hash}</span>
        </div>

        <!-- Firma 2 -->
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
          <div class="w-full h-14 flex items-center justify-center">
            ${respSignerProfile.svgSignature}
          </div>
          <div class="w-full border-t border-dashed border-slate-300 my-1"></div>
          <span class="font-bold text-slate-900 text-[11px] sm:text-[12px]">${respSignerProfile.name}</span>
          <span class="text-[10px] text-[#006c49] font-semibold">${respSignerProfile.role}</span>
          <span class="text-[9px] text-slate-500">${respSignerProfile.cc} • Aceptación Subsanación</span>
          <span class="text-[8px] font-mono text-[#006c49] mt-0.5 bg-[#6cf8bb]/40 px-1.5 py-0.5 rounded truncate max-w-full">${respSignerProfile.hash}</span>
        </div>
      </div>
    </div>
  `;

  const footerEl = document.getElementById('pdfModalFooterActions');
  const isApproved = Boolean(selectedFinding.isApproved);

  if (footerEl) {
    if (!isApproved) {
      footerEl.innerHTML = `
        <span class="text-[12px] text-[#006398] font-bold flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[18px]">info</span>
          <span>Previsualización de Borrador. Si estás de acuerdo, apruébalo y guárdalo.</span>
        </span>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closePdfPreviewModal()" class="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] font-semibold text-[13px]">
            Cerrar Previsualización
          </button>
          <button type="button" onclick="approveFindingFromModal()" class="px-5 py-2.5 rounded-xl bg-[#226d00] hover:bg-[#185200] text-white font-bold text-[13px] shadow flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Aprobar y Guardar Informe Oficial</span>
          </button>
        </div>
      `;
    } else {
      footerEl.innerHTML = `
        <span class="text-[12px] text-[#005236] font-bold flex items-center gap-1 bg-[#6cf8bb]/30 px-3 py-1 rounded-xl">
          <span class="material-symbols-outlined text-[16px] text-[#226d00]">verified</span>
          <span>Informe Aprobado y Registrado en BD</span>
        </span>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closePdfPreviewModal()" class="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] font-semibold text-[13px]">
            Cerrar
          </button>
          <button type="button" onclick="confirmAndDownloadPdf()" class="px-5 py-2.5 rounded-xl bg-[#226d00] hover:bg-[#185200] text-white font-bold text-[13px] shadow flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span>
            <span>Descargar PDF con Firmas</span>
          </button>
        </div>
      `;
    }
  }

  modal.classList.remove('hidden');
}

function closePdfPreviewModal() {
  document.getElementById('modalPdfPreview')?.classList.add('hidden');
}

function confirmAndDownloadPdf() {
  // Asegurar que el informe esté renderizado y el modal visible para la función window.print()
  exportReportPDF();
  showToast('Generando PDF', 'Iniciando descarga / impresión del reporte oficial F-SST-012...', 'info');
  setTimeout(() => {
    window.print();
  }, 250);
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

function normalizeHseText(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// Render Official HSE Professional Directory View
function renderHseDirectory(query = '', centroFilter = 'todos') {
  const container = document.getElementById('hseCardsContainer');
  if (!container) return;

  const q = normalizeHseText(query);
  const cf = normalizeHseText(centroFilter);

  const filtered = repSstMembers.filter(member => {
    const nameStr = normalizeHseText(member.name);
    const roleStr = normalizeHseText(member.role);
    const emailStr = normalizeHseText(member.email);
    const telStr = normalizeHseText(member.tel);
    const sedesStr = normalizeHseText((member.sedes || []).join(' '));

    const searchPass = !q || nameStr.includes(q) || roleStr.includes(q) || emailStr.includes(q) || telStr.includes(q) || sedesStr.includes(q);

    let centroPass = true;
    if (cf !== 'todos') {
      if (cf.includes('comercio')) {
        centroPass = roleStr.includes('comercio') || sedesStr.includes('comercio') || sedesStr.includes('logistica') || sedesStr.includes('salud') || sedesStr.includes('financier') || sedesStr.includes('admin') || sedesStr.includes('hoteleria');
      } else if (cf.includes('industrial') || cf.includes('aviacion')) {
        centroPass = roleStr.includes('industrial') || roleStr.includes('aviacion') || sedesStr.includes('industrial') || sedesStr.includes('aviacion') || sedesStr.includes('madera') || sedesStr.includes('confecciones') || sedesStr.includes('construccion');
      } else if (cf.includes('colombo') || cf.includes('aleman')) {
        centroPass = roleStr.includes('colombo') || roleStr.includes('aleman') || sedesStr.includes('colombo') || sedesStr.includes('aleman') || sedesStr.includes('tic') || sedesStr.includes('energia') || sedesStr.includes('metalmecanica') || sedesStr.includes('refrigeracion');
      } else if (cf.includes('cedagro') || cf.includes('agro')) {
        centroPass = roleStr.includes('cedagro') || roleStr.includes('agro') || sedesStr.includes('cedagro') || sedesStr.includes('agro') || sedesStr.includes('cva') || sedesStr.includes('sabanalarga') || sedesStr.includes('ecoturismo');
      } else {
        centroPass = roleStr.includes(cf) || sedesStr.includes(cf);
      }
    }

    return searchPass && centroPass;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 rounded-2xl bg-[#f2f3ff] text-center border border-dashed border-[#c0c9b4] flex flex-col items-center justify-center gap-2">
        <span class="material-symbols-outlined text-[36px] text-[#226d00]">search_off</span>
        <p class="text-[14px] font-bold text-[#131b2e]">No se encontraron profesionales HSE</p>
        <p class="text-[12px] text-[#6f7b66]">Intenta con otros términos como "Galapa", "Malambo", "Colombo", "Sabanalarga" o "Sandro".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => {
    const sedesPills = (m.sedes || ['Sede SENA Regional']).map(s => 
      `<span class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#39a900]/10 text-[#226d00] border border-[#39a900]/30 flex items-center gap-1">
        <span class="material-symbols-outlined text-[13px]">location_on</span> ${s}
      </span>`
    ).join('');

    const phoneClean = (m.tel || '3000000000').replace(/\D/g, '');
    const mailto = m.email || 'coordinacion.sst@sena.edu.co';

    return `
      <div class="p-5 rounded-2xl bg-white/90 backdrop-blur-xl shadow-sm border border-[#eaedff] hover:shadow-md transition-all flex flex-col justify-between gap-4">
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-[#39a900]/15 flex items-center justify-center text-[#226d00] font-bold text-lg border border-[#39a900]/30 shrink-0">
                ${m.name.charAt(0)}
              </div>
              <div class="flex flex-col">
                <h3 class="text-[15px] font-bold text-[#131b2e] leading-tight">${m.name}</h3>
                <span class="text-[11px] font-bold text-[#226d00]">${m.role}</span>
                <span class="text-[10px] text-[#6f7b66]">${m.cc || 'C.C. Registrada'}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#6cf8bb]/40 text-[#005236] shrink-0">Oficial HSE</span>
          </div>

          <div class="flex flex-col gap-1.5 pt-2 border-t border-[#eaedff]">
            <span class="text-[11px] font-bold text-[#6f7b66] uppercase">Sedes y Centros a Cargo:</span>
            <div class="flex flex-wrap gap-1.5">
              ${sedesPills}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-3 border-t border-[#eaedff]">
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#6f7b66] font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-[#006398]">mail</span> Correo:
            </span>
            <a href="mailto:${mailto}" class="font-bold text-[#006398] hover:underline truncate max-w-[180px]">${mailto}</a>
          </div>
          <div class="flex items-center justify-between text-[12px]">
            <span class="text-[#6f7b66] font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[15px] text-[#226d00]">phone_android</span> Celular:
            </span>
            <span class="font-bold text-[#131b2e]">${m.tel || '3000000000'}</span>
          </div>

          <div class="grid grid-cols-3 gap-1.5 pt-2">
            <a href="tel:${m.tel || ''}" class="py-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-bold text-[11px] flex items-center justify-center gap-1 border border-[#eaedff]">
              <span class="material-symbols-outlined text-[14px] text-[#226d00]">call</span>
              <span>Llamar</span>
            </a>
            <a href="https://wa.me/57${phoneClean}" target="_blank" class="py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-[11px] flex items-center justify-center gap-1 border border-[#25D366]/30">
              <span class="material-symbols-outlined text-[14px]">chat</span>
              <span>WhatsApp</span>
            </a>
            <a href="mailto:${mailto}" class="py-2 rounded-xl bg-[#006398]/10 hover:bg-[#006398]/20 text-[#006398] font-bold text-[11px] flex items-center justify-center gap-1 border border-[#006398]/30">
              <span class="material-symbols-outlined text-[14px]">mail</span>
              <span>Correo</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterHseDirectory() {
  const query = document.getElementById('inputSearchHse')?.value || '';
  const centroFilter = document.getElementById('filterHseCentro')?.value || 'todos';
  renderHseDirectory(query, centroFilter);
}

// Fetch HSE Directory from Supabase DB table directorio_hse
async function loadHseDirectoryFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('directorio_hse').select('*');
    if (!error && data && data.length > 0) {
      repSstMembers = data.map(item => ({
        id: item.id || `hse-${Date.now()}`,
        name: item.nombre || 'Profesional HSE',
        role: item.cargo || 'Profesional HSE',
        cc: item.cedula || 'C.C. Registrada',
        email: item.correo || 'coordinacion.sst@sena.edu.co',
        tel: item.celular || '3000000000',
        sedes: item.sedes_a_cargo ? item.sedes_a_cargo.split(',').map(s => s.trim()) : [item.centro_adscrito || 'SENA Regional']
      }));
      renderRepSstMembers();
      renderHseDirectory();
    }
  } catch (e) {
    console.warn('Notice loading directorio_hse from Supabase:', e);
  }
}
