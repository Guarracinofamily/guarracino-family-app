import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://susiietyztbbajxsbion.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c2lpZXR5enRiYmFqeHNiaW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDMzMTQsImV4cCI6MjA5NjI3OTMxNH0.DT149hK2viY9f9RStyiBWrUBAEgnfczPVBz4HnToThQ"
);

const INITIAL_TASKS = [
  // University & Enrollment
  { task_text: "Check IB results on candidate portal", category: "University & Enrollment", owner: "Emanuel", due_date: "5 Jul 2026", urgent: true, note: "Do first thing that morning" },
  { task_text: "Email VU International Student Advisor with transcript", category: "University & Enrollment", owner: "Emanuel", due_date: "5 Jul 2026", urgent: true, note: "Attach digital transcript from IB portal same day" },
  { task_text: "Pay tuition fee via Studielink", category: "University & Enrollment", owner: "Francesco", due_date: "Week of 7 Jul 2026", urgent: false, note: "€2,700 EU rate — needs SEPA or international transfer" },
  { task_text: "Send certified copy of IB diploma to VU by post", category: "University & Enrollment", owner: "Emanuel", due_date: "Before 1 Aug 2026", urgent: false, note: "Post to: De Boelelaan 1105, 1081 HV Amsterdam. School certifies it." },
  { task_text: "Confirm full enrolment status on Studielink", category: "University & Enrollment", owner: "Emanuel", due_date: "Before 31 Aug 2026", urgent: false, note: "Status must show 'enrolled' — hard deadline" },
  { task_text: "Register for VU introduction week", category: "University & Enrollment", owner: "Emanuel", due_date: "July 2026", urgent: false, note: "Important for settling in socially" },
  // Housing
  { task_text: "Register on HousingAnywhere via VU priority link", category: "Housing", owner: "Emanuel", due_date: "This week", urgent: true, note: "Email vip@housinganywhere.com — 20% discount + priority Amsterdam listings. Cost €26–55" },
  { task_text: "Register on Room.nl (DUWO student housing)", category: "Housing", owner: "Emanuel", due_date: "This week", urgent: true, note: "Queue-based allocation — every week counts. Free." },
  { task_text: "Register on Spotahome", category: "Housing", owner: "Emanuel", due_date: "This week", urgent: false, note: "Verified listings with video tours — good for booking remotely" },
  { task_text: "Register on Kamernet", category: "Housing", owner: "Emanuel", due_date: "This week", urgent: false, note: "Largest NL platform. Set alerts for €700–1,000 Amsterdam" },
  { task_text: "Check VU accommodation queue status on VU dashboard", category: "Housing", owner: "Emanuel", due_date: "Weekly check", urgent: false, note: "VU housing first-paid-first-served" },
  { task_text: "Sign rental contract", category: "Housing", owner: "Emanuel", due_date: "As soon as found", urgent: false, note: "Confirm registration possible for BSN before signing" },
  { task_text: "Pay first month + deposit", category: "Housing", owner: "Francesco", due_date: "On contract signing", urgent: false, note: "Target under €1,000/month. Budget 1–2 months deposit" },
  // Documents & Admin
  { task_text: "Initiate apostille process for Italian documents", category: "Documents & Admin", owner: "Francesco", due_date: "Immediately", urgent: true, note: "Long lead time — start now. Birth certificate minimum" },
  { task_text: "Check Emanuel's Italian passport expiry", category: "Documents & Admin", owner: "Emanuel", due_date: "Before Jul 2026", urgent: false, note: "Must be valid for full stay. EU citizen — no visa needed" },
  { task_text: "School issues certified final transcript", category: "Documents & Admin", owner: "Emanuel", due_date: "After IB results ~Jul 2026", urgent: false, note: "Request from Dubai school immediately after results" },
  { task_text: "Register for BSN number at Amsterdam municipality", category: "Documents & Admin", owner: "Emanuel", due_date: "Within 5 days of arrival", urgent: false, note: "Mandatory for everything. Book at gemeente.amsterdam.nl" },
  // Travel & Move
  { task_text: "Family flies Dubai → Italy", category: "Travel & Move", owner: "All", due_date: "2 Jul 2026", urgent: false, note: "Tickets already booked ✓" },
  { task_text: "Book Emanuel's flight Sicily → Amsterdam", category: "Travel & Move", owner: "Mamma", due_date: "Book by end Jun 2026", urgent: false, note: "Target late August. Ryanair/easyJet Catania–Amsterdam" },
  { task_text: "Arrange luggage / ship essential items", category: "Travel & Move", owner: "All", due_date: "August 2026", urgent: false, note: "Consider shipping a box — cheaper than extra baggage" },
  { task_text: "IKEA run on arrival in Amsterdam", category: "Travel & Move", owner: "Emanuel", due_date: "First week Amsterdam", urgent: false, note: "Bedding, kitchen basics. ~€200–300. IKEA Haarlem is closest" },
  // Life in Amsterdam
  { task_text: "Arrange Dutch health insurance", category: "Life in Amsterdam", owner: "Francesco", due_date: "From day 1 in NL", urgent: true, note: "Mandatory by law. ~€130–150/month. Check Zilveren Kruis or CZ" },
  { task_text: "Get Dutch SIM card / local number", category: "Life in Amsterdam", owner: "Emanuel", due_date: "Day of arrival", urgent: false, note: "Ben, Lebara or Simyo. €10–20/month. Buy at Schiphol" },
  { task_text: "Open Dutch bank account", category: "Life in Amsterdam", owner: "Emanuel", due_date: "First week Amsterdam", urgent: false, note: "Bunq (no BSN needed to start) or Revolut as bridge" },
  { task_text: "Get OV-chipkaart (public transport card)", category: "Life in Amsterdam", owner: "Emanuel", due_date: "Day of arrival", urgent: false, note: "€7.50 card + load credit. Available at Schiphol" },
  { task_text: "Set up monthly allowance transfer", category: "Life in Amsterdam", owner: "Francesco", due_date: "Before Emanuel arrives", urgent: false, note: "Target AED 8,000–10,000/month depending on rent" },
];

const OWNER_COLORS = {
  Francesco: { bg: "#e8f5e9", text: "#2d5a3d", border: "#2d5a3d" },
  Mamma: { bg: "#fff8e1", text: "#b45309", border: "#f59e0b" },
  Emanuel: { bg: "#e3f2fd", text: "#1565c0", border: "#1976d2" },
  All: { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" },
};

const CATEGORIES = ["All Tasks", "University & Enrollment", "Housing", "Documents & Admin", "Travel & Move", "Life in Amsterdam"];
const OWNERS = ["All", "Francesco", "Mamma", "Emanuel"];

const HOUSING_AGENCIES = [
  { name: "HousingAnywhere", badge: "VU Partner", desc: "VU partner — 20% discount via vip@housinganywhere.com. Verified, secure payments, reviews.", url: "https://housinganywhere.com", color: "#2d5a3d" },
  { name: "Room.nl / DUWO", badge: "Free to register", desc: "Official Dutch student housing. Register immediately — queue-based, every week counts.", url: "https://room.nl", color: "#1565c0" },
  { name: "Spotahome", badge: "Verified visits", desc: "Team physically visits every property. Landlord ratings. Good for remote booking.", url: "https://spotahome.com/amsterdam", color: "#7c3aed" },
  { name: "Kamernet", badge: "Set alerts", desc: "Largest NL platform. Mixed quality — set alerts €700–1,000 Amsterdam.", url: "https://kamernet.nl", color: "#b45309" },
  { name: "Hospi Housing", badge: "VU Recommended", desc: "VU-recommended homestay. Hundreds of verified host families. Free to use.", url: "https://hospihousing.com", color: "#be185d" },
];

const ONE_OFF_COSTS = [
  { item: "Flight Sicily → Amsterdam", eur: "€150–250", who: "Francesco" },
  { item: "VU tuition fee year 1", eur: "€2,700", who: "Francesco" },
  { item: "Housing deposit", eur: "€800–2,000", who: "Francesco" },
  { item: "First month rent", eur: "€800–1,000", who: "Francesco" },
  { item: "VU housing application fee", eur: "€500", who: "Done ✓" },
  { item: "HousingAnywhere subscription", eur: "€26–55", who: "Emanuel" },
  { item: "Bedding & household essentials (IKEA)", eur: "€200–300", who: "Francesco" },
  { item: "Books & study materials", eur: "€200–400", who: "Emanuel" },
  { item: "OV-chipkaart + initial load", eur: "€50", who: "Emanuel" },
  { item: "Dutch SIM card", eur: "€20–30", who: "Emanuel" },
  { item: "Dutch health insurance first month", eur: "€130–150", who: "Francesco" },
  { item: "Apostille documents", eur: "€100–200", who: "Francesco" },
  { item: "Misc / buffer", eur: "€300", who: "—" },
];

const MONTHLY_COSTS = [
  { item: "Rent", eur: "€800–1,000" },
  { item: "Food & groceries", eur: "€200–250" },
  { item: "Public transport", eur: "€80–100" },
  { item: "Phone", eur: "€15–20" },
  { item: "Health insurance", eur: "€130–150" },
  { item: "Social / going out", eur: "€150–200" },
  { item: "Books & misc", eur: "€50–100" },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tasks");
  const [activeCategory, setActiveCategory] = useState("All Tasks");
  const [activeOwner, setActiveOwner] = useState("All");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    loadTasks();
    const channel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => loadTasks())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function loadTasks() {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at");
    if (error) { console.error(error); setLoading(false); return; }
    if (data.length === 0 && !seeded) {
      await seedTasks();
    } else {
      setTasks(data);
      setLoading(false);
    }
  }

  async function seedTasks() {
    setSeeded(true);
    const { error } = await supabase.from("tasks").insert(INITIAL_TASKS);
    if (error) console.error("Seed error:", error);
    await loadTasks();
  }

  async function toggleTask(id, completed) {
    await supabase.from("tasks").update({ completed: !completed }).eq("id", id);
  }

  const filtered = tasks.filter(t => {
    const catMatch = activeCategory === "All Tasks" || t.category === activeCategory;
    const ownerMatch = activeOwner === "All" || t.owner === activeOwner;
    return catMatch && ownerMatch;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const urgentCount = tasks.filter(t => t.urgent && !t.completed).length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f7", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e3df", padding: "0 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>Guarracino</span>
                <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>Family App</span>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Emanuel → Amsterdam 2026</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#2d5a3d" }}>{progress}%</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>{completedCount}/{totalCount} done</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: "#f0ede8", borderRadius: 2, marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#2d5a3d", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {urgentCount > 0 && (
              <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#92400e", fontWeight: 500 }}>
                ⚡ {urgentCount} urgent
              </div>
            )}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#166534", fontWeight: 500 }}>
              ✓ {completedCount} completed
            </div>
            <div style={{ background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
              {totalCount - completedCount} remaining
            </div>
          </div>

          {/* Main tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
            {[["tasks", "📋 Tasks"], ["housing", "🏠 Housing"], ["budget", "💶 Budget"]].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: "10px 20px", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === key ? "2px solid #2d5a3d" : "2px solid transparent",
                color: activeTab === key ? "#2d5a3d" : "#6b7280",
                transition: "all 0.15s"
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px" }}>

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <>
            {/* Owner filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {OWNERS.map(owner => {
                const c = owner === "All" ? OWNER_COLORS.All : OWNER_COLORS[owner];
                return (
                  <button key={owner} onClick={() => setActiveOwner(owner)} style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    background: activeOwner === owner ? (owner === "All" ? "#1a1a1a" : c.bg) : "#fff",
                    color: activeOwner === owner ? (owner === "All" ? "#fff" : c.text) : "#6b7280",
                    border: activeOwner === owner ? `1.5px solid ${owner === "All" ? "#1a1a1a" : c.border}` : "1.5px solid #e5e7eb",
                    transition: "all 0.15s"
                  }}>{owner}</button>
                );
              })}
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  background: activeCategory === cat ? "#2d5a3d" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#6b7280",
                  border: activeCategory === cat ? "1.5px solid #2d5a3d" : "1.5px solid #e5e7eb",
                  transition: "all 0.15s"
                }}>{cat}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading tasks…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>No tasks for this filter.</div>
                )}
                {filtered.map(task => {
                  const c = OWNER_COLORS[task.owner] || OWNER_COLORS.All;
                  return (
                    <div key={task.id} onClick={() => toggleTask(task.id, task.completed)} style={{
                      background: task.completed ? "#fafafa" : "#fff",
                      border: `1px solid ${task.completed ? "#f0ede8" : "#e5e3df"}`,
                      borderRadius: 10, padding: "14px 16px", cursor: "pointer",
                      display: "flex", gap: 14, alignItems: "flex-start",
                      opacity: task.completed ? 0.6 : 1,
                      transition: "all 0.15s",
                      boxShadow: task.completed ? "none" : "0 1px 3px rgba(0,0,0,0.04)"
                    }}>
                      {/* Checkbox */}
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                        background: task.completed ? "#2d5a3d" : "#fff",
                        border: `2px solid ${task.completed ? "#2d5a3d" : "#d1d5db"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s"
                      }}>
                        {task.completed && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{
                            fontSize: 14, fontWeight: 500, color: task.completed ? "#9ca3af" : "#1a1a1a",
                            textDecoration: task.completed ? "line-through" : "none"
                          }}>{task.task_text}</span>
                          {task.urgent && !task.completed && (
                            <span style={{ fontSize: 10, fontWeight: 600, background: "#fef3c7", color: "#92400e", padding: "2px 7px", borderRadius: 10, border: "1px solid #fcd34d" }}>URGENT</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 11, background: c.bg, color: c.text, padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>{task.owner}</span>
                          {task.due_date && <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 {task.due_date}</span>}
                          {task.note && <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>· {task.note}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* HOUSING TAB */}
        {activeTab === "housing" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Housing Platforms</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Register on all 5. The more registered, the better the chances.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {HOUSING_AGENCIES.map(agency => (
                <a key={agency.name} href={agency.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "#fff", border: "1px solid #e5e3df", borderRadius: 12, padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 16,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.15s",
                    borderLeft: `4px solid ${agency.color}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{agency.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, background: agency.color + "18", color: agency.color, padding: "2px 8px", borderRadius: 10 }}>{agency.badge}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{agency.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, color: "#9ca3af" }}>→</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === "budget" && (
          <div>
            {/* One-off costs */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>One-Off Setup Costs</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Total estimate: €7,000–10,000</div>
              <div style={{ background: "#fff", border: "1px solid #e5e3df", borderRadius: 12, overflow: "hidden" }}>
                {ONE_OFF_COSTS.map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 16px", borderBottom: i < ONE_OFF_COSTS.length - 1 ? "1px solid #f0ede8" : "none",
                    background: i % 2 === 0 ? "#fff" : "#faf9f7"
                  }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>{row.item}</span>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>{row.who}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", minWidth: 90, textAlign: "right" }}>{row.eur}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly costs */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>Monthly Running Costs</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>~€1,425–1,820/month · AED 8,000–10,000 allowance</div>
              <div style={{ background: "#fff", border: "1px solid #e5e3df", borderRadius: 12, overflow: "hidden" }}>
                {MONTHLY_COSTS.map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 16px", borderBottom: i < MONTHLY_COSTS.length - 1 ? "1px solid #f0ede8" : "none",
                    background: i % 2 === 0 ? "#fff" : "#faf9f7"
                  }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>{row.item}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{row.eur}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 16px", background: "#f0fdf4", borderTop: "2px solid #bbf7d0" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>Monthly Total</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>~€1,425–1,820</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
