import { Action, Retro } from "./storage";

interface StorageState {
  actions: Map<string, Action>;
  retros: Map<string, Retro>;
  idCounter: number;
}

const globalForStorage = globalThis as unknown as { __storage?: StorageState };

function daysBefore(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function daysAfter(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
}

function daysBeforeDate(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
}

export function seedDemoData() {
  if (!globalForStorage.__storage) {
    globalForStorage.__storage = {
      actions: new Map(),
      retros: new Map(),
      idCounter: 0,
    };
  }

  const store = globalForStorage.__storage;

  // Don't re-seed if data already exists
  if (store.actions.size > 0) return;

  // --- RETRO 1: 45 days ago (old retro, reviewed) ---
  const retro1: Retro = {
    id: "retro-old-1",
    raw_notes: `Sprint 12 Retro - 2026-02-15
- CI/CD pipeline cok yavas, deployment 20dk suruyor. DevOps bakacak.
- Code review sureci iyilestirilmeli, PR'lar 3+ gun bekliyor.
- Unit test coverage %40'in altina dustu, her PR'da test zorunlu olmali.
- API dokumantasyonu eksik, yeni gelenler zorlanıyor.`,
    created_at: daysBefore(45),
    actions: ["action-old-1", "action-old-2", "action-old-3", "action-old-4"],
    reviewed: true,
  };

  const actionsRetro1: Action[] = [
    {
      id: "action-old-1",
      description: "CI/CD pipeline optimizasyonu - deployment suresini 5dk altina indir",
      category: "refactor",
      is_blocker: true,
      inferred_owner: "DevOps",
      status: "closed",
      created_at: daysBefore(45),
      closed_at: daysBefore(30),
      deadline: daysBeforeDate(35),
      closure_criteria: "Deployment suresi 5dk altina inmeli",
      risk_score: 0,
      retro_id: "retro-old-1",
      recurring_count: 0,
    },
    {
      id: "action-old-2",
      description: "Code review SLA tanimla - PR'lar max 24 saat beklemeli",
      category: "process",
      is_blocker: false,
      inferred_owner: null,
      status: "closed",
      created_at: daysBefore(45),
      closed_at: daysBefore(38),
      deadline: daysBeforeDate(38),
      closure_criteria: "Review SLA dokumante edilmis ve takip ediliyor",
      risk_score: 0,
      retro_id: "retro-old-1",
      recurring_count: 0,
    },
    {
      id: "action-old-3",
      description: "Unit test coverage %60'a cikarilmali, PR merge kriterine ekle",
      category: "process",
      is_blocker: false,
      inferred_owner: "Tech Lead",
      status: "in-progress",
      created_at: daysBefore(45),
      closed_at: null,
      deadline: daysBeforeDate(10),
      closure_criteria: "Coverage %60 uzerinde ve CI'da enforce ediliyor",
      risk_score: 75,
      retro_id: "retro-old-1",
      recurring_count: 1,
    },
    {
      id: "action-old-4",
      description: "API dokumantasyonunu Swagger/OpenAPI ile guncelleyin",
      category: "feature",
      is_blocker: false,
      inferred_owner: null,
      status: "open",
      created_at: daysBefore(45),
      closed_at: null,
      deadline: null,
      closure_criteria: null,
      risk_score: 85,
      retro_id: "retro-old-1",
      recurring_count: 2,
    },
  ];

  // --- RETRO 2: 14 days ago (recent, reviewed) ---
  const retro2: Retro = {
    id: "retro-recent-2",
    raw_notes: `Sprint 14 Retro - 2026-03-16
- Client'tan gelen istekler icin API req/res detayi eksik geliyor, her seferinde geri donuyoruz.
- QA sureci belirsiz, developer ne test edecek belli degil.
- 5G projesinde gelen acil konulara hizli organize olabiliyoruz.
- Otomasyon altyapisi POC olarak degerlendirilmeli, Oguzhan ile konusulacak.
- Ekip icindeki destek muhtesem, herkes birbirine yardim ediyor.`,
    created_at: daysBefore(14),
    actions: ["action-recent-1", "action-recent-2", "action-recent-3", "action-recent-4", "action-recent-5"],
    reviewed: true,
  };

  const actionsRetro2: Action[] = [
    {
      id: "action-recent-1",
      description: "Client API istekleri icin detayli req/res sablonu olustur",
      category: "process",
      is_blocker: true,
      inferred_owner: "Fantastic Xerus",
      status: "in-progress",
      created_at: daysBefore(14),
      closed_at: null,
      deadline: daysBeforeDate(2),
      closure_criteria: "Sablon olusturulmus ve client'a iletilmis",
      risk_score: 70,
      retro_id: "retro-recent-2",
      recurring_count: 1,
    },
    {
      id: "action-recent-2",
      description: "QA test adimlari ve sorumluluk matrisini belgele",
      category: "process",
      is_blocker: false,
      inferred_owner: "Unusual Vulture",
      status: "open",
      created_at: daysBefore(14),
      closed_at: null,
      deadline: daysAfter(3),
      closure_criteria: "Test matrisi dokumante edilmis, takimla paylasilmis",
      risk_score: 45,
      retro_id: "retro-recent-2",
      recurring_count: 0,
    },
    {
      id: "action-recent-3",
      description: "Otomasyon framework POC - Oguzhan ile degerlendirme toplantisi",
      category: "feature",
      is_blocker: false,
      inferred_owner: "Sophisticated Wombat",
      status: "open",
      created_at: daysBefore(14),
      closed_at: null,
      deadline: daysAfter(7),
      closure_criteria: "POC tamamlanmis, framework secimi yapilmis",
      risk_score: 35,
      retro_id: "retro-recent-2",
      recurring_count: 0,
    },
    {
      id: "action-recent-4",
      description: "STB sonrasi test sureci - developer testleri QA'e aktarim akisi",
      category: "process",
      is_blocker: false,
      inferred_owner: "Unusual Vulture",
      status: "in-progress",
      created_at: daysBefore(14),
      closed_at: null,
      deadline: daysAfter(1),
      closure_criteria: "Aktarim sureci dokumante edildi ve uygulanmaya baslandi",
      risk_score: 40,
      retro_id: "retro-recent-2",
      recurring_count: 0,
    },
    {
      id: "action-recent-5",
      description: "Backend bug fix sonrasi client bilgilendirme otomasyonu",
      category: "feature",
      is_blocker: false,
      inferred_owner: "Unusual Vulture",
      status: "closed",
      created_at: daysBefore(14),
      closed_at: daysBefore(7),
      deadline: daysBeforeDate(7),
      closure_criteria: "Otomatik bilgilendirme mail/slack mesaji gidiyor",
      risk_score: 0,
      retro_id: "retro-recent-2",
      recurring_count: 0,
    },
  ];

  // --- RETRO 3: Latest retro (the one from user, NOT reviewed - triggers gate) ---
  const retro3: Retro = {
    id: "retro-latest-3",
    raw_notes: `Sprint 15 Retro - 2026-03-30

## Start - yapmaya baslayalim
- Client'tan gelen mevcut isler icin api req/res ve is detayini tam almaliyiz.
- QA olmadan developerin test yapacagi islerde STB sonrasi testleri yapip clienta STB test done bilgisi verelim
- Client testleri devam eden projelerde backend buglari icin fix sonrasi testimizi yapip clienti bilgilendirelim.
- Dev test yapacagi ve guvenlik cagrisi gereken konularda QA'e isin detaylarinin aktarimini yapalim. PO, DEV?
- Otomasyon icin kullanilacak yapilar POC olarak erken asamada degerlendirilmeli

## Stop - durrr
- Paket adam efsane ama biz oyle degiliz, gelen isleri en detayina kadar sormaya calisalim.
- Bundan sonraki ekip degisikligine stop diyorum artik.

## Continue - devamm
- Alim cagrilari icin koordinasyon ve alim sonrasi takip
- 5G, Bundle gibi projelerde gelen kritik konular icin organize olup hizli cozum uretmek
- Ekip birbirine destek oluyor.
- Hizli aksyon ve is takibi, herkes birbirine destek olmaya calisiyo`,
    created_at: daysBefore(2),
    actions: [
      "action-latest-1", "action-latest-2", "action-latest-3",
      "action-latest-4", "action-latest-5", "action-latest-6",
    ],
    reviewed: false,
  };

  const actionsRetro3: Action[] = [
    {
      id: "action-latest-1",
      description: "Client'in istek attigi API'lerin req/res detayi tam olarak dokumante edilecek",
      category: "process",
      is_blocker: true,
      inferred_owner: "Fantastic Xerus",
      status: "open",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: daysAfter(5),
      closure_criteria: "Her API icin request/response ornegi yazilmis",
      risk_score: 50,
      retro_id: "retro-latest-3",
      recurring_count: 2,
    },
    {
      id: "action-latest-2",
      description: "Test adimlari yeni QA surecinden sonra tekrar degerlendirilecek",
      category: "process",
      is_blocker: false,
      inferred_owner: "Unusual Vulture",
      status: "open",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: daysAfter(10),
      closure_criteria: "QA surec dokumani guncellenmis ve takimla paylasilmis",
      risk_score: 25,
      retro_id: "retro-latest-3",
      recurring_count: 1,
    },
    {
      id: "action-latest-3",
      description: "Otomasyon projesi icin framework secimi - Oguzhan ile toplanti",
      category: "feature",
      is_blocker: false,
      inferred_owner: "Sophisticated Wombat",
      status: "open",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: daysAfter(14),
      closure_criteria: "Framework secilmis, ayri proje olarak repo olusturulmus",
      risk_score: 20,
      retro_id: "retro-latest-3",
      recurring_count: 1,
    },
    {
      id: "action-latest-4",
      description: "Gelen islerin detayini tam almak icin intake formu olustur",
      category: "process",
      is_blocker: false,
      inferred_owner: null,
      status: "open",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: null,
      closure_criteria: null,
      risk_score: 45,
      retro_id: "retro-latest-3",
      recurring_count: 0,
    },
    {
      id: "action-latest-5",
      description: "Guvenlik cagrisi gereken konularda QA'e detay aktarim sureci tanimla",
      category: "process",
      is_blocker: false,
      inferred_owner: "PO",
      status: "open",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: daysAfter(7),
      closure_criteria: "Aktarim template'i olusturulmus ve ilk is icin uygulanmis",
      risk_score: 30,
      retro_id: "retro-latest-3",
      recurring_count: 0,
    },
    {
      id: "action-latest-6",
      description: "Ekip degisikligi suresinde bilgi transferi checklist'i olustur",
      category: "process",
      is_blocker: false,
      inferred_owner: "Jumpy Llama",
      status: "in-progress",
      created_at: daysBefore(2),
      closed_at: null,
      deadline: daysAfter(2),
      closure_criteria: "Checklist hazir ve ilk transfer icin kullanildi",
      risk_score: 35,
      retro_id: "retro-latest-3",
      recurring_count: 0,
    },
  ];

  // Load all data
  store.retros.set(retro1.id, retro1);
  store.retros.set(retro2.id, retro2);
  store.retros.set(retro3.id, retro3);

  for (const action of [...actionsRetro1, ...actionsRetro2, ...actionsRetro3]) {
    store.actions.set(action.id, action);
  }

  store.idCounter = 100;
}
