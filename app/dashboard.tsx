"use client";

import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";

type IconName = "home" | "food" | "train" | "receipt" | "plus" | "arrow" | "chevron" | "chart" | "grid" | "bell" | "scan" | "close" | "spark" | "wallet" | "calendar" | "split" | "search" | "settings" | "help";
type PersonName = "Lena" | "Noah";
type Period = "September 2026" | "August 2026";
type TabName = "Overview" | "Activity" | "Insights" | "Budgets" | "Goals" | "Accounts" | "Settings" | "Help";
type Expense = {
  id: string;
  icon: IconName;
  merchant: string;
  amount: number;
  payer: PersonName;
  day: number;
  time: string;
  category: string;
  shared: boolean;
  note: string;
  added?: boolean;
  period?: Period;
  entryType?: "expense" | "transfer";
  grouped?: boolean;
  needsReview?: boolean;
};
type CategoryTotal = { label: string; amount: number; icon: IconName };
type ProfileData = {
  total: number;
  paid: number;
  personal: number;
  budget: number;
  categories: { label: string; amount: number }[];
};
type PeriodSummary = {
  income: number;
  sharedExpenses: number;
  sharedEssentials: number;
  householdBudget: number;
  fairness: string;
  profiles: Record<PersonName, ProfileData>;
  categories: CategoryTotal[];
  weekly: number[];
};
type ModalState =
  | { type: "receipt"; payer: PersonName }
  | { type: "settlement" }
  | { type: "transaction"; expense: Expense }
  | { type: "plan"; person: PersonName }
  | null;
type ReceiptDraft = { merchant: string; amount: string; payer: PersonName; category: string; shared: boolean };

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const icons: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8v9H3v-9Z"/><path d="M9 20v-6h6v6"/></>,
    food: <><path d="M4 5v6a3 3 0 0 0 6 0V5M7 5v15M13 5v7M13 5h2a3 3 0 0 1 3 3v5h-5"/></>,
    train: <><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M8 18 6 21M16 18l2 3M8 8h.01M16 8h.01M7 14h10"/></>,
    receipt: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    bell: <><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10M7 15h7M7 9h10"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    spark: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/>,
    wallet: <><path d="M4 7a3 3 0 0 1 3-3h11v16H6a2 2 0 0 1-2-2V7Z"/><path d="M4 8h15a2 2 0 0 1 2 2v5h-5a2 2 0 0 1 0-4h5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
    split: <><path d="M12 3v18M5 7h3a4 4 0 0 1 4 4v1M19 17h-3a4 4 0 0 1-4-4v-1"/><circle cx="5" cy="7" r="2"/><circle cx="19" cy="17" r="2"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.3a1.8 1.8 0 0 1-3.6 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1A1.8 1.8 0 0 1 5 15.2l.1-.1a1.7 1.7 0 0 0-1.2-2.9h-.3a1.8 1.8 0 0 1 0-3.6h.2a1.7 1.7 0 0 0 1.2-2.9L5 5.6A1.8 1.8 0 0 1 7.5 3l.1.1a1.7 1.7 0 0 0 2.9-1.2v-.3a1.8 1.8 0 0 1 3.6 0v.2A1.7 1.7 0 0 0 17 3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.3a1.8 1.8 0 0 1 0 3.6h-.2a1.7 1.7 0 0 0-1.4 3Z" transform="translate(-1 -1) scale(.95)"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.4 2.4 0 1 1 4.6.9c-.8 1.4-2.3 1.5-2.3 3.1M12 16.5h.01"/></>,
  };

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

const periodData: Record<Period, PeriodSummary> = {
  "September 2026": {
    income: 4850,
    sharedExpenses: 2630.4,
    sharedEssentials: 2030.4,
    householdBudget: 3000,
    fairness: "46 / 54",
  profiles: {
      Lena: { total: 1184.2, paid: 1418, personal: 271.8, budget: 1267.2, categories: [{ label: "Food & drink", amount: 156.3 }, { label: "Culture", amount: 71.2 }, { label: "Small things", amount: 44.3 }] },
      Noah: { total: 1446.2, paid: 1212.4, personal: 338.1, budget: 1492.2, categories: [{ label: "Cycling", amount: 143.8 }, { label: "Getting around", amount: 92.2 }, { label: "Reading", amount: 38.5 }, { label: "Other", amount: 63.6 }] },
    },
    categories: [{ label: "Home & bills", amount: 1426.5, icon: "home" }, { label: "Food & everyday", amount: 463.8, icon: "food" }, { label: "Getting around", amount: 210.1, icon: "train" }, { label: "Shared moments", amount: 530, icon: "spark" }],
    weekly: [542, 614, 708, 766],
  },
  "August 2026": {
    income: 4068,
    sharedExpenses: 4297,
    sharedEssentials: 0,
    householdBudget: 0,
    fairness: "1 / 2",
    profiles: {
      Lena: { total: 4297, paid: 1650, personal: 2647, budget: 0, categories: [{ label: "Digital & online", amount: 822 }, { label: "Other & review", amount: 753 }, { label: "Bills & repayments", amount: 725 }] },
      Noah: { total: 0, paid: 0, personal: 0, budget: 0, categories: [] },
    },
    categories: [{ label: "Household transfers", amount: 1650, icon: "home" }, { label: "Bills & repayments", amount: 725, icon: "wallet" }, { label: "Digital & online", amount: 822, icon: "receipt" }, { label: "Food & transport", amount: 347, icon: "food" }, { label: "Other & review", amount: 753, icon: "chart" }],
    weekly: [827, 214, 983, 2273],
  },
};

const initialExpenses: Expense[] = [
  { id: "rent", icon: "home", merchant: "Studio rent", amount: 1240, payer: "Noah", day: 1, time: "09:41", category: "Home & bills", shared: true, note: "Monthly rent for the apartment.", period: "September 2026" },
  { id: "market", icon: "food", merchant: "Kreuzberg Market", amount: 86.4, payer: "Lena", day: 26, time: "18:12", category: "Food & everyday", shared: true, note: "Groceries for the week, plus an optimistic amount of peaches.", period: "September 2026" },
  { id: "bvg", icon: "train", merchant: "BVG monthly pass", amount: 49, payer: "Noah", day: 24, time: "08:03", category: "Getting around", shared: false, note: "Noah’s personal monthly transit pass.", period: "September 2026" },
  { id: "brunch", icon: "food", merchant: "Sunday brunch", amount: 52.8, payer: "Lena", day: 21, time: "11:26", category: "Shared moments", shared: true, note: "A shared brunch after a slow start.", period: "September 2026" },
  { id: "internet", icon: "home", merchant: "Internet bill", amount: 39.99, payer: "Noah", day: 18, time: "07:10", category: "Home & bills", shared: true, note: "Monthly home internet subscription.", period: "September 2026" },
  { id: "bookshop", icon: "receipt", merchant: "Neukölln Bookshop", amount: 28, payer: "Lena", day: 15, time: "16:42", category: "Culture", shared: false, note: "A book Lena picked up on the way home.", period: "September 2026" },
  { id: "plants", icon: "home", merchant: "Household plants", amount: 46.5, payer: "Lena", day: 12, time: "14:06", category: "Home & bills", shared: true, note: "Two plants for the living room. They have names now.", period: "September 2026" },
  { id: "bike", icon: "train", merchant: "Bike repair", amount: 42, payer: "Noah", day: 9, time: "10:15", category: "Getting around", shared: false, note: "New brake pads for Noah’s bike.", period: "September 2026" },
  { id: "dinner", icon: "food", merchant: "Dinner at Lila", amount: 74.2, payer: "Noah", day: 6, time: "20:14", category: "Shared moments", shared: true, note: "Dinner out together on Friday.", period: "September 2026" },
  { id: "electric", icon: "home", merchant: "Electricity", amount: 68.9, payer: "Lena", day: 3, time: "06:32", category: "Home & bills", shared: true, note: "Monthly electricity payment.", period: "September 2026" },
  { id: "aug-transfers", icon: "home", merchant: "Household transfers (2)", amount: 1650, payer: "Lena", day: 31, time: "", category: "Household transfers", shared: false, entryType: "transfer", grouped: true, note: "Two statement entries explicitly marked for living costs and the household grocery pot. Amount is summarized; this is a contribution, not a second copy of purchases.", period: "August 2026" },
  { id: "aug-bills", icon: "wallet", merchant: "Bills & repayments", amount: 725, payer: "Lena", day: 31, time: "", category: "Bills & repayments", shared: false, grouped: true, needsReview: true, note: "Rounded category total from recurring charges and repayments. Merchant details are intentionally masked; confirm which items belong in the household budget.", period: "August 2026" },
  { id: "aug-online", icon: "receipt", merchant: "Online & digital purchases", amount: 822, payer: "Lena", day: 31, time: "", category: "Digital & online", shared: false, grouped: true, needsReview: true, note: "Rounded monthly group. Payment processors can hide the final merchant, so review before assigning a shared split.", period: "August 2026" },
  { id: "aug-everyday", icon: "food", merchant: "Groceries & transport", amount: 347, payer: "Lena", day: 31, time: "", category: "Food & transport", shared: false, grouped: true, needsReview: true, note: "Rounded category group. Individual purchases and locations are omitted; decide which were shared.", period: "August 2026" },
  { id: "aug-review", icon: "chart", merchant: "Other entries to review", amount: 753, payer: "Lena", day: 31, time: "", category: "Other & review", shared: false, grouped: true, needsReview: true, note: "Rounded group of uncategorized purchases and savings transfers. Savings movements should be kept separate from spending.", period: "August 2026" },
];

const categories = ["Home & bills", "Food & everyday", "Getting around", "Shared moments", "Culture", "Food & drink", "Cycling", "Reading", "Small things", "Other", "Household transfers", "Bills & repayments", "Digital & online", "Food & transport", "Other & review"];
const people: PersonName[] = ["Lena", "Noah"];

function money(amount: number) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);
}

function makeDate(expense: Expense, period: Period) {
  if (expense.grouped) return period.startsWith("September") ? "Sep · sample group" : "Aug · grouped statement data";
  return `${period.startsWith("September") ? "Sep" : "Aug"} ${expense.day} · ${expense.time}`;
}

function ActivityRow({ expense, period, detailed, onOpen }: { expense: Expense; period: Period; detailed?: boolean; onOpen: () => void }) {
  return <article className={`activity-row ${detailed ? "detailed-row" : ""}`}>
    <span className={`activity-icon ${expense.shared ? "shared" : "personal"}`}><Icon name={expense.icon} size={18}/></span>
    <div className="merchant"><strong>{expense.merchant}{expense.added && <i className="new-entry">new</i>}{expense.needsReview && <i className="review-entry">review</i>}</strong><small>{makeDate(expense, period)} · {expense.category} · {expense.entryType === "transfer" ? "Household contribution" : expense.shared ? "Shared · 50 / 50" : expense.needsReview ? "Needs a split decision" : "Personal"}</small></div>
    <div className="payer"><span>{expense.payer} paid</span><strong>{money(expense.amount)}</strong></div>
    <button aria-label={`View ${expense.merchant}`} onClick={onOpen}><Icon name="arrow" size={15}/></button>
  </article>;
}

function FlowPartnerCard({ person, data, period, menuOpen, onToggleMenu, onSeeActivity, onAddReceipt, onEditPlan, onCategory }: {
  person: PersonName; data: ProfileData; period: Period; menuOpen: boolean;
  onToggleMenu: () => void; onSeeActivity: () => void; onAddReceipt: () => void; onEditPlan: () => void;
  onCategory: (person: PersonName, category: string) => void;
}) {
  const statementMode = period === "August 2026";
  const statementOwner = statementMode && person === "Lena";
  const noStatement = statementMode && person === "Noah";
  const difference = data.budget - data.total;
  const peak = Math.max(1, ...data.categories.map((item) => item.amount));
  return <>
    <article className={`flow-island-card ${person.toLowerCase()}`}>
      <header className="partner-card-head">
        <span className={`profile-avatar ${person.toLowerCase()}`}>{person === "Lena" ? "L" : "N"}</span>
        <div><h2>{person}</h2><span>{statementOwner ? "Anonymized statement sample" : noStatement ? "Partner · no statement" : "Personal account"}</span></div>
        <div className="island-menu-wrap"><button className="island-menu" aria-label={`${person}'s account actions`} aria-expanded={menuOpen} onClick={onToggleMenu}>···</button>
          {menuOpen && <div className="profile-menu" role="menu"><p>{person}&apos;s account</p><button role="menuitem" onClick={onSeeActivity}>See {person}&apos;s activity</button><button role="menuitem" onClick={onAddReceipt}>Add an expense</button><button role="menuitem" onClick={onEditPlan}>Adjust monthly plan</button></div>}
        </div>
      </header>
      <div className="partner-spend"><span>{statementOwner ? "Statement outflow" : noStatement ? "Awaiting statement" : "This month spend"}</span><div><strong>{noStatement ? "—" : money(data.total)}</strong>{!noStatement && <span className="mini-bars" aria-hidden="true">{[28, 40, 54, 68, 82, 100].map((height) => <i key={height} style={{ height: `${height}%` }}/>)}</span>}</div><small>{statementOwner ? data.budget > 0 ? `${money(Math.abs(difference))} ${difference >= 0 ? "under" : "over"} your plan` : "61 debit entries · grouped for privacy" : noStatement ? "This side stays out of the split for now." : <><b>↓</b> {money(Math.abs(difference))} {difference >= 0 ? "under" : "over"} plan</>}</small></div>
      <div className="partner-mini-stats"><div><span>{statementMode ? "Household transfers" : "Paid towards shared"}</span><strong>{noStatement ? "Not linked" : money(data.paid)}</strong></div><div><span>{statementMode ? "Other outflow" : "Personal expense"}</span><strong>{noStatement ? "—" : money(data.personal)}</strong></div></div>
      <section className="partner-categories"><h3>{statementMode ? "Largest outflow groups" : "Top personal categories"}</h3>{data.categories.length ? data.categories.slice(0, 3).map((item, index) => <button key={item.label} onClick={() => onCategory(person, item.label)}><span className={`category-dot category-${index}`}><Icon name={index === 0 ? "food" : index === 1 ? "spark" : "receipt"} size={15}/></span><span className="partner-category-main"><span><b>{item.label}</b><strong>{money(item.amount)}</strong></span><i><b style={{ width: `${Math.max(8, item.amount / peak * 100)}%` }}/></i></span><Icon name="arrow" size={14}/></button>) : <p className="statement-empty-copy">Import this account to see their side of the household.</p>}</section>
      <button className="partner-activity-link" onClick={onSeeActivity}>View {person}&apos;s activity <Icon name="arrow" size={14}/></button>
    </article>
  </>;
}

function FlowOverview({ summary, profiles, transactions, period, settled, menuPerson, onOpenSettlement, onOpenTransaction, onToggleMenu, onSeeActivity, onAddReceipt, onEditPlan, onGoToInsights, onGoToAccounts, onCategory }: {
  summary: PeriodSummary; profiles: Record<PersonName, ProfileData>; transactions: Expense[]; period: Period; settled: boolean; menuPerson: PersonName | null;
  onOpenSettlement: () => void; onOpenTransaction: (expense: Expense) => void; onToggleMenu: (person: PersonName) => void;
  onSeeActivity: (person: PersonName) => void; onAddReceipt: (person: PersonName) => void; onEditPlan: (person: PersonName) => void;
  onGoToInsights: () => void; onGoToAccounts: () => void; onCategory: (person: PersonName | "Everyone", category: string) => void;
}) {
  const statementMode = period === "August 2026";
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const leftAhead = profiles.Lena.paid - summary.sharedExpenses / 2;
  const owing = Math.abs(leftAhead);
  const aheadPerson = leftAhead >= 0 ? "Lena" : "Noah";
  const labelFor = (index: number) => ["#ee938c", "#e8b35f", "#77a9e8", "#9a91ce"][index % 4];
  const categoryItems = summary.categories.map((category, index) => ({ ...category, color: labelFor(index), share: Math.round(category.amount / summary.sharedExpenses * 100) }));
  const hoveredItem = categoryItems.find((item) => item.label === hoveredCategory);
  const trendMonths = period.startsWith("September") ? ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] : ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const paired = (person: PersonName) => ({ menuOpen: menuPerson === person, onToggleMenu: () => onToggleMenu(person), onSeeActivity: () => onSeeActivity(person), onAddReceipt: () => onAddReceipt(person), onEditPlan: () => onEditPlan(person) });

  return <>
    <section className="flow-overview-grid" aria-label="Household expenses overview">
      <FlowPartnerCard person="Lena" data={profiles.Lena} period={period} {...paired("Lena")} onCategory={onCategory}/>
      <section className="household-panel">
        <div className="household-heading"><div><p className="eyebrow">{statementMode ? "ACCOUNT SNAPSHOT · ONE STATEMENT" : "HOUSEHOLD FINANCES"}</p><h1>Where the money is moving</h1><p>{statementMode ? "August groups are rounded and merchant-masked; Lena is a demo alias, and the other account is not included." : `Income, expenses and savings for ${period}.`}</p></div><button className="balance-card" onClick={statementMode ? () => onCategory("Everyone", "Household transfers") : onOpenSettlement}><span>{statementMode ? "Transfers to household" : "Household balance"}</span><strong>{statementMode ? money(profiles.Lena.paid) : money(settled ? 0 : Math.max(0, summary.income - summary.sharedExpenses))}</strong><Icon name="arrow" size={16}/></button></div>
        <section className="money-flow-card"><div className="flow-card-heading"><h2>{statementMode ? "Statement outflow by category" : "Shared money flow"}</h2><span aria-live="polite"><i/>{hoveredItem ? `${hoveredItem.label} · ${money(hoveredItem.amount)} · ${hoveredItem.share}% of outflow` : statementMode ? "61 DEBITS · MASKED GROUPS" : "DEMO DATA"}</span></div>
          <div className="money-flow-stage">
            <svg className="money-flow-ribbons" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
              <path className="source-ribbon lena-ribbon" d="M175 74 C275 74 300 107 391 133 L391 153 C300 129 275 91 175 91Z"/>
              <path className="source-ribbon noah-ribbon" d="M175 207 C275 207 305 180 391 153 L391 174 C305 202 275 224 175 224Z"/>
              {categoryItems.map((item, index) => {
                const y = 20 + index * 59;
                const paths = [`M408 139 C500 139 505 ${y + 28} 612 ${y + 28} L612 ${y + 42} C505 ${y + 42} 500 153 408 153Z`, `M408 145 C500 145 505 ${y + 28} 612 ${y + 28} L612 ${y + 42} C505 ${y + 42} 500 159 408 159Z`, `M408 151 C500 151 505 ${y + 28} 612 ${y + 28} L612 ${y + 42} C505 ${y + 42} 500 165 408 165Z`, `M408 157 C500 157 505 ${y + 28} 612 ${y + 28} L612 ${y + 42} C505 ${y + 42} 500 171 408 171Z`];
                return <path key={item.label} className={`category-ribbon ribbon-${index} ${hoveredCategory === item.label ? "is-highlighted" : ""}`} d={paths[index % paths.length]} style={{ "--ribbon": item.color } as React.CSSProperties} onMouseEnter={() => setHoveredCategory(item.label)} onMouseLeave={() => setHoveredCategory(null)}><title>{item.label}: {money(item.amount)}, {item.share}% of shared expenses</title></path>;
              })}
            </svg>
            <div className="flow-sources"><div className="source-card"><span className="profile-avatar lena">L</span><span><small>{statementMode ? "Lena · account inflow" : "Lena"}</small><strong>{money(statementMode ? summary.income : profiles.Lena.paid)}</strong></span></div><div className="source-card"><span className="profile-avatar noah">N</span><span><small>{statementMode ? "Noah · no statement" : "Noah"}</small><strong>{statementMode ? "Not included" : money(profiles.Noah.paid)}</strong></span></div></div>
            <div className="flow-total"><span className="flow-total-icon"><Icon name={statementMode ? "chart" : "home"} size={24}/></span><small>{statementMode ? "Total account outflow" : "Shared expenses"}</small><strong>{money(summary.sharedExpenses)}</strong><em>{statementMode ? "rounded statement groups" : "this month"}</em></div>
            <div className="flow-targets">{categoryItems.map((item, index) => <button key={item.label} className={`flow-category-card ribbon-${index} ${hoveredCategory === item.label ? "is-highlighted" : ""}`} style={{ "--ribbon": item.color } as React.CSSProperties} title={`${money(item.amount)} · ${item.share}% of ${statementMode ? "statement outflow" : "shared expenses"}`} onMouseEnter={() => setHoveredCategory(item.label)} onMouseLeave={() => setHoveredCategory(null)} onFocus={() => setHoveredCategory(item.label)} onBlur={() => setHoveredCategory(null)} onClick={() => onCategory("Everyone", item.label)}><span className={`flow-category-icon ribbon-${index}`} style={{ "--ribbon": item.color } as React.CSSProperties}><Icon name={item.icon} size={16}/></span><span className="flow-category-copy"><small>{item.label}</small><strong>{money(item.amount)}</strong></span><span className="flow-category-share">{item.share}%</span></button>)}</div>
          </div>
        </section>
        <div className="household-summary-cards"><article className="summary-bubble income"><span className="summary-bubble-icon">↑</span><span><small>{statementMode ? "Income in statement" : "Shared income"}</small><strong>{money(summary.income)}</strong><em>{statementMode ? "4 incoming entries · rounded" : "received this month"}</em></span></article><article className="summary-bubble expenses"><span className="summary-bubble-icon">↘</span><span><small>{statementMode ? "Account outflow" : "Shared expenses"}</small><strong>{money(summary.sharedExpenses)}</strong><em>{statementMode ? "61 debit entries · grouped" : `${money(Math.max(0, summary.householdBudget - summary.sharedExpenses))} under plan`}</em></span></article><button className="summary-stat fairness" onClick={onGoToInsights}><span className="summary-bubble-icon"><Icon name={statementMode ? "receipt" : "split"} size={19}/></span><span><small>{statementMode ? "Statement coverage" : "Split fairness"}</small><strong>{statementMode ? "1 of 2 accounts" : summary.fairness}</strong><em>{statementMode ? "No fairness estimate yet" : "Lena · Noah"}</em></span></button><button className="summary-stat settlement-suggestion" onClick={statementMode ? onGoToAccounts : onOpenSettlement}><span className="summary-bubble-icon"><Icon name={statementMode ? "plus" : "wallet"} size={19}/></span><span><small>{statementMode ? "Next useful step" : "Settlement suggestion"}</small><strong>{statementMode ? "Add partner data" : settled ? "All even for now" : `${aheadPerson} is ahead by ${money(owing)}`}</strong><em>{statementMode ? "A fair split needs both sides" : settled ? "Marked as settled" : "Tap to review"}</em></span><Icon name="arrow" size={15}/></button></div>
      </section>
      <FlowPartnerCard person="Noah" data={profiles.Noah} period={period} {...paired("Noah")} onCategory={onCategory}/>
    </section>
    <section className="overview-lower-grid" aria-label="Household trends and recent transactions">
      <PartnerRecent person="Lena" transactions={transactions} period={period} onSeeActivity={() => onSeeActivity("Lena")} onOpen={onOpenTransaction}/>
      <div className="overview-charts">
      <article className="chart-panel breakdown-panel"><div className="compact-heading"><h2>{statementMode ? "Statement outflow groups" : "Shared expense breakdown"}</h2><button onClick={onGoToInsights}>Details <Icon name="arrow" size={14}/></button></div><div className="breakdown-content"><div className="donut-chart" role="img" aria-label={`${statementMode ? "Statement outflow" : "Shared expenses"} total ${money(summary.sharedExpenses)}`}><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="46" fill="none" stroke="#eef2ef" strokeWidth="16"/>{categoryItems.map((item, index) => { const circumference = 2 * Math.PI * 46; const offset = categoryItems.slice(0, index).reduce((sum, part) => sum + part.amount / summary.sharedExpenses * circumference, 0); return <circle key={item.label} cx="60" cy="60" r="46" fill="none" stroke={item.color} strokeWidth="16" strokeDasharray={`${item.amount / summary.sharedExpenses * circumference} ${circumference}`} strokeDashoffset={-offset} transform="rotate(-90 60 60)"/>; })}</svg><div><strong>{money(summary.sharedExpenses)}</strong><span>{statementMode ? "Account outflow" : "Total shared"}</span></div></div><div className="breakdown-legend">{categoryItems.map((item) => <button key={item.label} onClick={() => onCategory("Everyone", item.label)}><i style={{ background: item.color }}/><span>{item.label}</span><small>{item.share}%</small><strong>{money(item.amount)}</strong></button>)}</div></div></article>
      <article className="chart-panel trend-panel"><div className="compact-heading"><h2>{statementMode ? "August outflow by week" : "Monthly trend"}</h2><button onClick={onGoToInsights}>{statementMode ? "Analysis" : "Reports"} <Icon name="arrow" size={14}/></button></div><div className="monthly-chart" role="img" aria-label={statementMode ? `Weekly statement outflow: ${summary.weekly.map(money).join(", ")}` : "Monthly demo income and expense trend"}>{statementMode ? summary.weekly.map((amount, index) => <div className="month-bars" key={index}><div><i className="expense-bar" style={{ height: `${amount / Math.max(...summary.weekly) * 100}%` }}/></div><span>Week {index + 1}</span></div>) : trendMonths.map((month, index) => { const income = [55, 67, 62, 70, 82, 100][index]; const expense = [42, 57, 52, 54, 63, 83][index]; return <div className={`month-bars ${index === 5 ? "current" : ""}`} key={month}><div><i className="income-bar" style={{ height: `${income}%` }}/><i className="expense-bar" style={{ height: `${expense}%` }}/></div><span>{month}</span></div>; })}</div><div className="chart-legend">{statementMode ? <span><i/> Statement outflow</span> : <><span><i/> Income</span><span><i/> Expenses</span></>}</div></article>
      </div>
      <PartnerRecent person="Noah" transactions={transactions} period={period} onSeeActivity={() => onSeeActivity("Noah")} onOpen={onOpenTransaction}/>
    </section>
  </>;
}

function PartnerRecent({ person, transactions, period, onSeeActivity, onOpen }: { person: PersonName; transactions: Expense[]; period: Period; onSeeActivity: () => void; onOpen: (expense: Expense) => void }) {
  const recent = transactions.filter((expense) => expense.payer === person).sort((a, b) => b.day - a.day).slice(0, 3);
  const noStatement = period === "August 2026" && person === "Noah";
  return <article className={`partner-recent ${person.toLowerCase()}`}><div className="compact-heading"><h3>{noStatement ? "Partner account" : "Recent transactions"}</h3><button onClick={onSeeActivity}>{noStatement ? "Open account" : "View all"} <Icon name="arrow" size={14}/></button></div>{recent.length ? recent.map((expense) => <ActivityRow key={expense.id} expense={expense} period={period} onOpen={() => onOpen(expense)}/>) : <p className="statement-empty-copy">No partner statement in this sample. Their share is intentionally left unknown.</p>}</article>;
}

function ActivityView({ expenses, period, person, onPersonChange, onOpen, initialQuery = "", initialCategory = "All categories" }: { expenses: Expense[]; period: Period; person: string; onPersonChange: (person: string) => void; onOpen: (expense: Expense) => void; initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [kind, setKind] = useState("All entries");
  const statementMode = period === "August 2026";
  const visible = expenses.filter((expense) => {
    const searchMatch = `${expense.merchant} ${expense.category} ${expense.payer}`.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = category === "All categories" || expense.category === category;
    const personMatch = person === "Everyone" || expense.payer === person;
    const kindMatch = kind === "All entries" || (kind === "Shared expenses" ? expense.shared && expense.entryType !== "transfer" : kind === "Personal expenses" ? !expense.shared && expense.entryType !== "transfer" : kind === "Household transfers" ? expense.entryType === "transfer" : kind === "Needs review" ? expense.needsReview === true : false);
    return searchMatch && categoryMatch && personMatch && kindMatch;
  });
  const statementGroupCount = expenses.filter((expense) => expense.grouped).length;
  const sharedTotal = visible.filter((item) => item.shared).reduce((total, item) => total + item.amount, 0);

  return <section className="tab-page activity-page">
    <div className="page-heading"><div><p className="eyebrow">THE HOUSEHOLD LEDGER</p><h1>Every little thing, <em>in one place.</em></h1><p>{statementMode ? "A privacy-safe August statement sample, grouped by category. Individual merchants are hidden." : "Browse the demo transactions and see who paid, what was shared, and where it landed."}</p></div><span className="demo-stamp">{period} · {statementMode ? "Statement-shaped demo" : "Demo data"}</span></div>
    <div className="activity-toolbar"><label className="search-field"><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Merchant, category, or partner"/></label><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Partner</span><select id="activity-person-filter" value={person} onChange={(event) => onPersonChange(event.target.value)}><option>Everyone</option>{people.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Type</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option>All entries</option><option>Shared expenses</option><option>Personal expenses</option><option>Household transfers</option><option>Needs review</option></select></label></div>
    <div className="activity-summary"><div><small>{statementMode ? "Privacy-safe groups" : "Showing"}</small><strong>{statementMode ? visible.every((item) => item.grouped) ? `${visible.length} of ${statementGroupCount} groups` : `${visible.length} visible entries` : `${visible.length} demo entries`}</strong></div><div><small>{statementMode ? "Explicit household transfers" : "Shared in this view"}</small><strong>{statementMode ? money(visible.filter((item) => item.entryType === "transfer").reduce((total, item) => total + item.amount, 0)) : money(sharedTotal)}</strong></div><div><small>Selected month</small><strong>{period}</strong></div></div>
    <section className="activity-table"><div className="activity-table-head"><span>Expense</span><span>Paid by</span><span>Amount</span><span/></div>{visible.length ? visible.map((expense) => <ActivityRow key={expense.id} expense={expense} period={period} detailed onOpen={() => onOpen(expense)}/>) : <div className="empty-state"><span><Icon name="receipt" size={22}/></span><h2>No matching expenses</h2><p>Try a different search or clear one of the filters.</p><button onClick={() => { setQuery(""); setCategory("All categories"); onPersonChange("Everyone"); setKind("All entries"); }}>Clear filters</button></div>}</section>
    <p className="demo-footnote">{statementMode ? "Rounded category groups are based on one statement. They are not transaction-level records; ambiguous expenses need review before a shared split is suggested." : "This is a small sample of the household ledger. Imported receipts are added here as demo entries."}</p>
  </section>;
}

function InsightsView({ summary, sharedExpenses, period, transactions, onOpenActivity }: { summary: PeriodSummary; sharedExpenses: number; period: Period; transactions: Expense[]; onOpenActivity: () => void }) {
  const addedCategories = transactions.filter((expense) => expense.added && expense.shared && expense.period === period).reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
    return totals;
  }, {});
  const knownCategories = new Set(summary.categories.map((item) => item.label));
  const dynamicCategories = [
    ...summary.categories.map((item) => ({ ...item, amount: item.amount + (addedCategories[item.label] ?? 0) })),
    ...Object.entries(addedCategories).filter(([label]) => !knownCategories.has(label)).map(([label, amount]) => ({ label, amount, icon: "receipt" as IconName })),
  ];
  const statementMode = period === "August 2026";
  const maxCategory = Math.max(1, ...dynamicCategories.map((item) => item.amount));
  const hasPlan = summary.householdBudget > 0;
  const spentPercent = hasPlan ? Math.round((sharedExpenses / summary.householdBudget) * 100) : 0;
  const monthRemaining = hasPlan ? Math.max(0, summary.householdBudget - sharedExpenses) : 0;
  const averageWeekly = sharedExpenses / 4;
  const weeklyTotals = [...summary.weekly];
  transactions.filter((expense) => expense.added && expense.shared && expense.period === period).forEach((expense) => {
    const weekIndex = Math.max(0, Math.min(3, Math.ceil(expense.day / 7) - 1));
    weeklyTotals[weekIndex] += expense.amount;
  });
  const peakWeek = Math.max(...weeklyTotals);
  const weeklyBars = weeklyTotals.map((amount, index) => ({ amount, label: `Week ${index + 1}`, height: `${Math.max(8, (amount / peakWeek) * 100)}%` }));
  const expenseDelta = statementMode ? "61 debit entries, grouped and rounded" : period.startsWith("September") ? "12% more than August" : "8% more than July";

  return <section className="tab-page insights-page">
    <div className="page-heading"><div><p className="eyebrow">{statementMode ? "ONE ACCOUNT · AUGUST SNAPSHOT" : "THE SHARED PICTURE"}</p><h1>A few patterns <em>worth noticing.</em></h1><p>{statementMode ? "Rounded statement groups are useful for exploring the product, but they are not a complete household view." : "Friendly numbers for the household, with no judgment about the extra pastry."}</p></div><span className="demo-stamp">{period} · {statementMode ? "Statement-shaped demo" : "Demo data"}</span></div>
    <div className="insight-stats"><article><span className="insight-icon"><Icon name="wallet" size={18}/></span><small>{statementMode ? "Account outflow" : "Shared expenses"}</small><strong>{money(sharedExpenses)}</strong><em>{expenseDelta}</em></article><article><span className="insight-icon"><Icon name="split" size={18}/></span><small>{statementMode ? "Income recorded" : "Shared income"}</small><strong>{money(summary.income)}</strong><em>{statementMode ? "4 incoming entries, rounded" : `${money(Math.max(0, summary.income - sharedExpenses))} remains`}</em></article><article><span className="insight-icon"><Icon name="chart" size={18}/></span><small>Weekly average</small><strong>{money(averageWeekly)}</strong><em>{statementMode ? "Across four statement weeks" : "Across four weeks"}</em></article><article><span className="insight-icon"><Icon name="calendar" size={18}/></span><small>{statementMode ? "Source coverage" : "Shared plan"}</small><strong>{statementMode ? "1 of 2" : hasPlan ? `${spentPercent}% used` : "No plan"}</strong><em>{statementMode ? "Partner side not included" : hasPlan ? `${money(monthRemaining)} left this month` : "Set a household plan when ready"}</em></article></div>
    <div className="insight-grid"><article className="insight-card trend-card"><div className="insight-card-heading"><div><p className="eyebrow">WEEK BY WEEK</p><h2>{statementMode ? "Statement outflow" : "Steady household rhythm"}</h2></div><span>{period.startsWith("September") ? "September" : "August"}</span></div><div className="weekly-chart" role="img" aria-label={`${statementMode ? "Weekly statement outflow" : "Weekly shared spending"}. ${weeklyBars.map((bar) => `${bar.label}: ${money(bar.amount)}`).join(", ")}`}><div className="chart-guides"><i/><i/><i/></div>{weeklyBars.map((bar) => <div className="week-column" key={bar.label}><strong>{money(bar.amount)}</strong><div><i style={{ height: bar.height }}/></div><span>{bar.label}</span></div>)}</div><p className="chart-note">{statementMode ? "The final statement week carries the household transfers and several month-end charges." : "Home costs arrive early. The rest of the month stays fairly even."}</p></article>
      <article className="insight-card category-card"><div className="insight-card-heading"><div><p className="eyebrow">WHERE IT GOES</p><h2>{statementMode ? "Outflow groups" : "Shared categories"}</h2></div><button onClick={onOpenActivity}>Open ledger <Icon name="arrow" size={14}/></button></div><div className="category-breakdown">{dynamicCategories.map((item) => <div className="category-breakdown-row" key={item.label}><span className="category-mark"><Icon name={item.icon} size={15}/></span><div className="category-breakdown-main"><div><strong>{item.label}</strong><b>{money(item.amount)}</b></div><i><span style={{ width: `${Math.max(4, (item.amount / maxCategory) * 100)}%` }}/></i></div></div>)}</div><p className="chart-note">{statementMode ? "Merchant names are masked; ‘Other & review’ includes entries that need context." : "Housing leads this month, as rent tends to do."}</p></article>
      <article className="insight-card balance-card"><div className="insight-card-heading"><div><p className="eyebrow">{statementMode ? "SOURCE COVERAGE" : "THE FAIR SPLIT"}</p><h2>{statementMode ? "No split estimate yet." : "Both sides of the household"}</h2></div><span><Icon name={statementMode ? "receipt" : "split"} size={17}/></span></div>{statementMode ? <><div className="partner-share"><div className="partner-share-label"><span><i/> Lena · statement sample</span><strong>Included</strong></div><div className="partner-track"><i style={{ width: "100%" }}/></div></div><div className="partner-share"><div className="partner-share-label"><span><i/> Noah · partner side</span><strong>Missing</strong></div><div className="partner-track"><i style={{ width: "0%" }}/></div></div><p className="chart-note">A fair split needs both partners&apos; activity. The absent account is left blank, not guessed.</p></> : <><div className="partner-share"><div className="partner-share-label"><span><i/> Lena</span><strong>{summary.fairness.split(" / ")[0]}%</strong></div><div className="partner-track"><i style={{ width: `${summary.fairness.split(" / ")[0]}%` }}/></div></div><div className="partner-share"><div className="partner-share-label"><span><i/> Noah</span><strong>{summary.fairness.split(" / ")[1]}%</strong></div><div className="partner-track"><i style={{ width: `${summary.fairness.split(" / ")[1]}%` }}/></div></div><p className="chart-note">Shared costs are close to an even split. Personal spending stays in each person&apos;s own island.</p></>}</article>
      <article className="insight-card budget-card">{statementMode ? <><p className="eyebrow">NEEDS A HUMAN LOOK</p><h2>Transfers are not the same as expenses.</h2><p>About {money(1650)} is clearly a household contribution. The other grouped charges need context before they can be called shared.</p><div className="budget-meter"><span><i/> entries to review</span><strong>{money(753)} grouped</strong><div><i style={{ width: "72%" }}/></div></div><button onClick={onOpenActivity}>Review grouped entries <Icon name="arrow" size={15}/></button></> : <><p className="eyebrow">A SMALL HEADS-UP</p><h2>{spentPercent >= 85 ? "The shared plan is in its final stretch." : "Plenty of room in the shared plan."}</h2><p>You&apos;ve used {spentPercent}% of the {money(summary.householdBudget)} plan, with {money(monthRemaining)} still available. Home costs are the biggest part of the picture.</p><div className="budget-meter"><span><i/> shared plan</span><strong>{money(sharedExpenses)} / {money(summary.householdBudget)}</strong><div><i style={{ width: `${Math.min(100, spentPercent)}%` }}/></div></div><button onClick={onOpenActivity}>Review shared expenses <Icon name="arrow" size={15}/></button></>}</article></div>
  </section>;
}

function DemoSection({ tab, summary, profiles, period, goalProgress, emailUpdates, onGoalProgress, onEmailUpdates, onRoute, onReceipt, onEditPlan, onPersonActivity }: {
  tab: TabName; summary: PeriodSummary; profiles: Record<PersonName, ProfileData>; period: Period; goalProgress: number; emailUpdates: boolean;
  onGoalProgress: () => void; onEmailUpdates: () => void; onRoute: (route: TabName) => void; onReceipt: () => void;
  onEditPlan: (person: PersonName) => void; onPersonActivity: (person: PersonName) => void;
}) {
  const statementMode = period === "August 2026";
  if (tab === "Budgets") {
    const planActive = summary.householdBudget > 0;
    const usedPercent = planActive ? Math.round(summary.sharedExpenses / summary.householdBudget * 100) : 0;
    return <section className="demo-section-page"><div className="page-heading"><div><p className="eyebrow">A PLAN, NOT A SCOLDING</p><h1>Room for the <em>important things.</em></h1><p>{period === "August 2026" ? "The statement sample has no budget, so this page leaves the target blank instead of guessing." : `Monthly household and personal spending plans for ${period}.`}</p></div><span className="demo-stamp">{planActive ? "Demo budget" : "No plan recorded"}</span></div><div className="demo-cards-grid"><article className="demo-info-card budget-feature"><span className="demo-card-icon"><Icon name="wallet"/></span><p className="eyebrow">{period === "August 2026" ? "STATEMENT SUMMARY" : "SHARED HOUSEHOLD PLAN"}</p><h2>{planActive ? <>{money(summary.sharedExpenses)} <small>of {money(summary.householdBudget)}</small></> : "No household plan"}</h2>{planActive ? <div className="budget-meter"><span><i/> {usedPercent}% used</span><strong>{money(Math.max(0, summary.householdBudget - summary.sharedExpenses))} left</strong><div><i style={{ width: `${Math.min(100, usedPercent)}%` }}/></div></div> : <p>No target was inferred from account activity. Add one when you know what feels right for both of you.</p>}<button className="text-action" onClick={() => onRoute("Insights")}>See spending report <Icon name="arrow" size={15}/></button></article>{people.map((person) => { const profile = profiles[person]; const noStatement = period === "August 2026" && person === "Noah"; return <article className="demo-info-card" key={person}><span className={`profile-avatar ${person.toLowerCase()}`}>{person === "Lena" ? "L" : "N"}</span><p className="eyebrow">{person.toUpperCase()}&apos;S MONTHLY PLAN</p><h2>{noStatement ? "No statement" : money(profile.total)} <small>{profile.budget > 0 ? `of ${money(profile.budget)}` : "· no plan set"}</small></h2><p>{noStatement ? "This partner side is intentionally left blank in the August sample." : profile.budget > 0 ? `${money(Math.max(0, profile.budget - profile.total))} still available for the month.` : "The statement does not say which spending target you prefer."}</p><button className="text-action" onClick={() => onEditPlan(person)}>Set {person}&apos;s plan <Icon name="arrow" size={15}/></button></article>; })}</div><article className="demo-info-card budget-category-card"><div className="compact-heading"><h2>{period === "August 2026" ? "Statement groups" : "Shared plan by category"}</h2><button onClick={() => onRoute("Insights")}>Full report <Icon name="arrow" size={14}/></button></div>{summary.categories.map((item) => <div className="budget-category-row" key={item.label}><span><Icon name={item.icon} size={16}/>{item.label}</span><strong>{money(item.amount)}</strong><i><b style={{ width: planActive ? `${Math.min(100, item.amount / summary.householdBudget * 100 * 2.4)}%` : "0%" }}/></i></div>)}</article></section>;
  }

  if (tab === "Goals") return <section className="demo-section-page"><div className="page-heading"><div><p className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p><h1>Plans with <em>a future tense.</em></h1><p>Shared goals make the everyday spending feel connected to what comes next.</p></div><span className="demo-stamp">One shared goal</span></div><article className="goal-card"><div className="goal-card-copy"><span className="demo-card-icon"><Icon name="spark" size={21}/></span><p className="eyebrow">YOUR HOUSEHOLD GOAL</p><h2>A long weekend<br/>somewhere green</h2><p>Four days out of town, questionable hiking shoes very much included.</p><div className="goal-amount"><strong>€{Math.round(goalProgress / 100 * 2500)} <small>saved</small></strong><span>of €2,500</span></div><div className="goal-progress"><i style={{ width: `${goalProgress}%` }}/></div><small>{goalProgress}% there · {Math.max(0, 100 - goalProgress)}% of the packing list remains</small><button className="primary-button" onClick={onGoalProgress}>Add €100 to demo savings</button></div><div className="goal-illustration" aria-hidden="true"><span className="sun-disc"/><span className="hill hill-back"/><span className="hill hill-front"/><span className="goal-tent"/></div></article><div className="demo-cards-grid goal-foot-cards"><article className="demo-info-card"><p className="eyebrow">MONTHLY CONTRIBUTION</p><h2>€250 <small>together</small></h2><p>Automatically set aside in this fictional demo.</p></article><article className="demo-info-card"><p className="eyebrow">NEXT CHECK-IN</p><h2>October 1</h2><p>Review your savings pace over a coffee.</p></article></div></section>;

  if (tab === "Accounts") return <section className="demo-section-page"><div className="page-heading"><div><p className="eyebrow">YOUR LITTLE MONEY TEAM</p><h1>Two accounts, <em>one household.</em></h1><p>{period === "August 2026" ? "One anonymized statement sample, one blank partner side. Nothing is connected to a real bank." : "These are demo profiles only. Nothing is connected to a real bank."}</p></div><span className="demo-stamp">{period === "August 2026" ? "1 sample · 1 missing" : "Local demo profiles"}</span></div><div className="demo-cards-grid account-grid">{people.map((person) => { const noStatement = period === "August 2026" && person === "Noah"; const statementOwner = period === "August 2026" && person === "Lena"; return <article className={`demo-info-card account-demo-card ${person.toLowerCase()}`} key={person}><div className="account-demo-head"><span className={`profile-avatar ${person.toLowerCase()}`}>{person === "Lena" ? "L" : "N"}</span><div><h2>{person}</h2><p>{statementOwner ? "Anonymized statement groups" : noStatement ? "Partner profile · no statement" : "Personal account · Demo"}</p></div></div><div className="account-demo-balance"><span>{statementOwner ? "Statement outflow" : noStatement ? "August activity" : "Month-to-date spending"}</span><strong>{noStatement ? "Not included" : money(profiles[person].total)}</strong></div><div className="account-demo-balance"><span>{statementMode ? "Household transfers" : "Paid towards shared"}</span><strong>{noStatement ? "—" : money(profiles[person].paid)}</strong></div><div className="account-actions"><button onClick={() => onPersonActivity(person)}>View transactions <Icon name="arrow" size={14}/></button><button onClick={() => onEditPlan(person)}>Edit monthly plan</button><button onClick={onReceipt}>Add a receipt</button></div></article>; })}<article className="demo-info-card household-account-card"><span className="demo-card-icon"><Icon name="home"/></span><p className="eyebrow">SHARED HOUSEHOLD</p><h2>Lena &amp; Noah&apos;s place</h2><p>Berlin · EUR · Together since the first utility bill.</p><button className="text-action" onClick={() => onRoute("Settings")}>Household preferences <Icon name="arrow" size={15}/></button></article></div></section>;

  if (tab === "Settings") return <section className="demo-section-page"><div className="page-heading"><div><p className="eyebrow">MAKE IT YOURS</p><h1>Household <em>preferences.</em></h1><p>Small choices for the way your demo household appears and keeps in touch.</p></div><span className="demo-stamp">Saved in this session</span></div><article className="settings-card"><div className="settings-row"><span className="demo-card-icon"><Icon name="calendar"/></span><div><strong>Default month</strong><small>Open the household on the current demo month.</small></div><span className="settings-value">{period}</span></div><div className="settings-row"><span className="demo-card-icon"><Icon name="bell"/></span><div><strong>Gentle household updates</strong><small>Show friendly reminders about plans and settle-ups.</small></div><button className={`toggle-switch ${emailUpdates ? "on" : ""}`} role="switch" aria-checked={emailUpdates} aria-label="Toggle household updates" onClick={onEmailUpdates}><i/></button></div><div className="settings-row"><span className="demo-card-icon"><Icon name="wallet"/></span><div><strong>Currency</strong><small>Used for amounts throughout the demo.</small></div><span className="settings-value">Euro · EUR</span></div><div className="settings-row"><span className="demo-card-icon"><Icon name="grid"/></span><div><strong>Personal accounts</strong><small>Manage profile plans and recent activity.</small></div><button className="text-action" onClick={() => onRoute("Accounts")}>Open accounts <Icon name="arrow" size={14}/></button></div></article></section>;

  return <section className="demo-section-page"><div className="page-heading"><div><p className="eyebrow">A HAND IF YOU NEED ONE</p><h1>Good questions, <em>small answers.</em></h1><p>{statementMode ? "August is a privacy-safe, statement-shaped demo; the other partner and September remain fictional." : "Everything here is sample data, but the paths through the demo are real."}</p></div><span className="demo-stamp">Demo help</span></div><div className="help-layout"><article className="help-card"><h2>How does receipt capture work?</h2><p>Pick an image or PDF. For this demo, we fill in an editable sample transaction so you can see how the real OpenAI extraction flow will feel.</p><button className="primary-button" onClick={onReceipt}><Icon name="plus" size={16}/> Try adding a receipt</button></article><div className="faq-list"><details open><summary>Is my bank connected?</summary><p>No bank is connected. August uses rounded, merchant-masked category groups shaped by one statement. The PDF and its account identifiers are not stored in this app or sent to OpenAI or Neon.</p></details><details><summary>How are shared expenses identified?</summary><p>Only clear household transfers are labeled as contributions. Other grouped purchases stay unassigned until both partners confirm what was shared.</p></details><details><summary>Can I change the monthly plan?</summary><p>Yes. Open a partner account menu or the Budgets page. The statement sample contains no budget, so August starts without a target.</p></details><details><summary>Where do the reports come from?</summary><p>August summarizes rounded groups from one statement; September uses fictional household data. Neither month is live bank data.</p></details></div></div></section>;
}

export default function Dashboard() {
  const [tab, setTab] = useState<TabName>("Overview");
  const [period, setPeriod] = useState<Period>("August 2026");
  const [popover, setPopover] = useState<"period" | "notifications" | "household" | null>(null);
  const [menuPerson, setMenuPerson] = useState<PersonName | null>(null);
  const [notificationUnread, setNotificationUnread] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [fileName, setFileName] = useState("");
  const [receiptDraft, setReceiptDraft] = useState<ReceiptDraft>({ merchant: "Kreuzberg Market", amount: "34.80", payer: "Lena", category: "Food & everyday", shared: true });
  const [planDraft, setPlanDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [transactions, setTransactions] = useState(initialExpenses);
  const [activityPerson, setActivityPerson] = useState("Everyone");
  const [activityCategory, setActivityCategory] = useState("All categories");
  const [activityQuery, setActivityQuery] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [goalProgress, setGoalProgress] = useState(68);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [plans, setPlans] = useState<Record<Period, Record<PersonName, number>>>({
    "September 2026": { Lena: periodData["September 2026"].profiles.Lena.budget, Noah: periodData["September 2026"].profiles.Noah.budget },
    "August 2026": { Lena: periodData["August 2026"].profiles.Lena.budget, Noah: periodData["August 2026"].profiles.Noah.budget },
  });
  const [settledPeriod, setSettledPeriod] = useState<Period | null>(null);
  const toastTimer = useRef<number | null>(null);

  const base = periodData[period];
  const periodTransactions = transactions.filter((expense) => !expense.period || expense.period === period);
  const demoAdds = periodTransactions.filter((expense) => expense.added);
  const addedShared = demoAdds.filter((expense) => expense.shared).reduce((total, expense) => total + expense.amount, 0);
  const addedEssentials = demoAdds.filter((expense) => expense.shared && ["Home & bills", "Food & everyday"].includes(expense.category)).reduce((total, expense) => total + expense.amount, 0);
  const sharedAddsByCategory = demoAdds.filter((expense) => expense.shared).reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
    return totals;
  }, {});
  const knownSharedCategories = new Set(base.categories.map((category) => category.label));
  const sharedCategories = [
    ...base.categories.map((category) => ({ ...category, amount: category.amount + (sharedAddsByCategory[category.label] ?? 0) })),
    ...Object.entries(sharedAddsByCategory).filter(([label]) => !knownSharedCategories.has(label)).map(([label, amount]) => ({ label, amount, icon: "receipt" as IconName })),
  ];
  const summary: PeriodSummary = { ...base, categories: sharedCategories, sharedExpenses: base.sharedExpenses + addedShared, sharedEssentials: base.sharedEssentials + addedEssentials };
  const profiles = Object.fromEntries(people.map((person) => {
    const addedByPerson = demoAdds.filter((expense) => expense.payer === person);
    const sharedByPerson = addedByPerson.filter((expense) => expense.shared).reduce((total, expense) => total + expense.amount, 0);
    const personalByPerson = addedByPerson.filter((expense) => !expense.shared).reduce((total, expense) => total + expense.amount, 0);
    const personalAddsByCategory = addedByPerson.filter((expense) => !expense.shared).reduce<Record<string, number>>((totals, expense) => {
      totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
      return totals;
    }, {});
    const knownPersonalCategories = new Set(base.profiles[person].categories.map((category) => category.label));
    const personalCategories = [
      ...base.profiles[person].categories.map((category) => ({ ...category, amount: category.amount + (personalAddsByCategory[category.label] ?? 0) })),
      ...Object.entries(personalAddsByCategory).filter(([label]) => !knownPersonalCategories.has(label)).map(([label, amount]) => ({ label, amount })),
    ].sort((a, b) => b.amount - a.amount);
    return [person, { ...base.profiles[person], categories: personalCategories, total: base.profiles[person].total + addedByPerson.reduce((total, expense) => total + expense.amount, 0), paid: base.profiles[person].paid + sharedByPerson, personal: base.profiles[person].personal + personalByPerson, budget: plans[period][person] }];
  })) as Record<PersonName, ProfileData>;
  const settled = settledPeriod === period;

  const notify = (message: string) => {
    setNotice(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setNotice(""), 4500);
  };
  const navigate = (next: TabName, filterPerson?: PersonName) => {
    setTab(next);
    if (next === "Activity") {
      setActivityPerson(filterPerson ?? "Everyone");
      setActivityCategory("All categories");
      setActivityQuery("");
    }
    setPopover(null);
    setSearchOpen(false);
    setMenuPerson(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const choosePeriod = (next: Period) => {
    setPeriod(next);
    setPopover(null);
    setMenuPerson(null);
  };
  const openReceipt = (payer: PersonName = "Lena") => {
    setFileName("");
    setReceiptDraft({ merchant: "Kreuzberg Market", amount: "34.80", payer, category: "Food & everyday", shared: true });
    setModal({ type: "receipt", payer });
    setPopover(null);
    setMenuPerson(null);
  };
  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const guessedName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    if (guessedName && !/^img\s?\d+$/i.test(guessedName)) {
      setReceiptDraft((draft) => ({ ...draft, merchant: guessedName.replace(/\b\w/g, (letter) => letter.toUpperCase()) }));
    }
  };
  const importReceipt = () => {
    if (!fileName) return;
    const amount = Number(receiptDraft.amount.replace(",", "."));
    if (!receiptDraft.merchant.trim() || !Number.isFinite(amount) || amount <= 0) {
      notify("Add a merchant and a valid amount to continue.");
      return;
    }
    const newExpense: Expense = {
      id: `demo-${Date.now()}`,
      icon: "receipt",
      merchant: receiptDraft.merchant.trim(),
      amount,
      payer: receiptDraft.payer,
      day: 27,
      time: "10:24",
      category: receiptDraft.category,
      shared: receiptDraft.shared,
      note: `Demo extraction from ${fileName}. You can edit the extracted fields before adding it.`,
      added: true,
      period,
    };
    setTransactions((current) => [newExpense, ...current]);
    setSettledPeriod(null);
    setModal(null);
    setFileName("");
    setReceiptDraft({ merchant: "Kreuzberg Market", amount: "34.80", payer: "Lena", category: "Food & everyday", shared: true });
    navigate("Activity");
    notify(`${newExpense.merchant} added to the demo ledger.`);
  };
  const openPlan = (person: PersonName) => {
    setPlanDraft(String(plans[period][person]));
    setModal({ type: "plan", person });
    setMenuPerson(null);
  };
  const savePlan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modal?.type !== "plan") return;
    const target = Number(planDraft.replace(",", "."));
    if (!Number.isFinite(target) || target <= 0) {
      notify("Enter a monthly target greater than zero.");
      return;
    }
    setPlans((current) => ({ ...current, [period]: { ...current[period], [modal.person]: target } }));
    setModal(null);
    notify(`${modal.person}'s monthly plan was updated for this demo.`);
  };
  const openPersonActivity = (person: PersonName) => navigate("Activity", person);
  const openCategoryActivity = (person: PersonName | "Everyone", category: string) => {
    if (person === "Everyone") navigate("Activity");
    else navigate("Activity", person);
    setActivityCategory(category);
  };
  const submitGlobalSearch = () => {
    navigate("Activity");
    setActivityQuery(globalSearch.trim());
    setActivityCategory("All categories");
  };
  const closeModal = () => {
    setModal(null);
    setFileName("");
  };
  const openTransaction = (expense: Expense) => setModal({ type: "transaction", expense });
  const togglePopover = (target: "period" | "notifications" | "household") => {
    setPopover((current) => current === target ? null : target);
    if (target === "notifications") setNotificationUnread(false);
  };
  const mainNavigation: { label: string; route: TabName; icon: IconName }[] = [
    { label: "Overview", route: "Overview", icon: "home" },
    { label: "Transactions", route: "Activity", icon: "receipt" },
    { label: "Budgets", route: "Budgets", icon: "calendar" },
    { label: "Goals", route: "Goals", icon: "spark" },
    { label: "Reports", route: "Insights", icon: "chart" },
    { label: "Accounts", route: "Accounts", icon: "wallet" },
  ];
  const searchMatches = globalSearch.trim() ? periodTransactions.filter((expense) => `${expense.merchant} ${expense.category} ${expense.payer}`.toLowerCase().includes(globalSearch.trim().toLowerCase())).slice(0, 5) : [];

  return <main className="app-shell flow-app-shell">
    <aside className="side-rail">
      <a className="flow-brand" href="#overview" onClick={(event) => { event.preventDefault(); navigate("Overview"); }}><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M5 20C4 10 11 4 23 4c0 12-6 19-16 18"/><path d="M7 21 18 9"/></svg><span>Togetherly</span></a>
      <nav className="rail-navigation" aria-label="Main navigation">{mainNavigation.map((item) => { const selected = tab === item.route; return <button key={item.label} onClick={() => navigate(item.route)} className={selected ? "selected" : ""} aria-current={selected ? "page" : undefined}><Icon name={item.icon} size={18}/><span>{item.label}</span></button>; })}</nav>
      <nav className="rail-footer" aria-label="Support and settings"><button className={tab === "Settings" ? "selected" : ""} onClick={() => navigate("Settings")} aria-label="Settings" aria-current={tab === "Settings" ? "page" : undefined}><Icon name="settings" size={18}/><span>Settings</span></button><button className={tab === "Help" ? "selected" : ""} onClick={() => navigate("Help")} aria-label="Help" aria-current={tab === "Help" ? "page" : undefined}><Icon name="help" size={18}/><span>Help</span></button></nav>
    </aside>
    <div className="workspace">
      <header className="flow-topbar">
        <form className="global-search" role="search" onSubmit={(event) => { event.preventDefault(); submitGlobalSearch(); }}><Icon name="search" size={17}/><input aria-label="Search transactions, categories, or merchants" placeholder="Search transactions, categories, or merchants…" value={globalSearch} onFocus={() => setSearchOpen(true)} onChange={(event) => { setGlobalSearch(event.target.value); setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }}/><button type="submit" aria-label="Search"><Icon name="arrow" size={16}/></button>
          {searchOpen && globalSearch.trim() && <div className="search-results">{searchMatches.length ? searchMatches.map((expense) => <button type="button" key={expense.id} onClick={() => { setSearchOpen(false); openTransaction(expense); }}><span className="search-result-icon"><Icon name={expense.icon} size={15}/></span><span><strong>{expense.merchant}</strong><small>{expense.category} · {expense.payer}</small></span><b>{money(expense.amount)}</b></button>) : <button type="submit" className="search-all"><span>Search all transactions for “{globalSearch}”</span><Icon name="arrow" size={14}/></button>}</div>}
        </form>
        <div className="top-controls">
          <div className="popover-anchor period-anchor"><button className="period" aria-haspopup="menu" aria-expanded={popover === "period"} onClick={() => togglePopover("period")}><Icon name="calendar" size={16}/><span>{period.replace(" 2026", " '26")}</span><Icon name="chevron" size={14}/></button>
            {popover === "period" && <div className="header-popover period-popover" role="menu"><p>Choose a demo month</p>{(["September 2026", "August 2026"] as Period[]).map((item) => <button role="menuitemradio" aria-checked={period === item} className={period === item ? "active-option" : ""} key={item} onClick={() => choosePeriod(item)}><span>{item}</span>{period === item && <i>Selected</i>}</button>)}</div>}
          </div>
          <div className="popover-anchor household-anchor"><button className="household-switch" aria-haspopup="menu" aria-expanded={popover === "household"} onClick={() => togglePopover("household")}><Icon name="home" size={18}/><span><small>Household</small><strong>Lena &amp; Noah</strong></span><Icon name="chevron" size={14}/></button>{popover === "household" && <div className="header-popover household-popover" role="menu"><p>Current household</p><button className="active-option" role="menuitem" onClick={() => navigate("Overview")}><span>Lena &amp; Noah</span><i>Selected</i></button><button role="menuitem" onClick={() => navigate("Accounts")}><span>Manage household accounts</span><Icon name="arrow" size={14}/></button><button role="menuitem" onClick={() => navigate("Settings")}><span>Household preferences</span><Icon name="arrow" size={14}/></button></div>}</div>
          <div className="header-avatars"><button className="avatar-control lena" aria-label="View Lena's activity" onClick={() => openPersonActivity("Lena")}>L</button><button className="avatar-control noah" aria-label="View Noah's activity" onClick={() => openPersonActivity("Noah")}>N</button><div className="popover-anchor notification-anchor"><button className="notification" aria-label="Notifications" aria-haspopup="dialog" aria-expanded={popover === "notifications"} onClick={() => togglePopover("notifications")}><Icon name="chevron" size={15}/>{notificationUnread && <i/>}</button>
            {popover === "notifications" && <div className="header-popover notifications-popover"><div className="popover-heading"><div><p className="eyebrow">HOUSEHOLD NOTES</p><strong>{period === "August 2026" ? "A note about this sample" : "A few things to check in on"}</strong></div><span className="quiet-mark"/></div><button onClick={() => { if (period === "August 2026") navigate("Accounts"); else { setPopover(null); setModal({ type: "settlement" }); } }}><span className="notification-icon"><Icon name={period === "August 2026" ? "receipt" : "split"} size={16}/></span><span><strong>{period === "August 2026" ? "Partner statement missing" : "One small settle-up"}</strong><small>{period === "August 2026" ? "A fair split needs both accounts." : `${profiles.Lena.paid - summary.sharedExpenses / 2 >= 0 ? "Lena" : "Noah"} is ahead by ${money(Math.abs(profiles.Lena.paid - summary.sharedExpenses / 2))} this month.`}</small></span><Icon name="arrow" size={14}/></button><button onClick={() => period === "August 2026" ? openCategoryActivity("Everyone", "Household transfers") : navigate("Insights")}><span className="notification-icon"><Icon name="chart" size={16}/></span><span><strong>{period === "August 2026" ? "Transfers are kept separate" : "Home leads the shared spend"}</strong><small>{period === "August 2026" ? "See the household contributions." : "See the month at a glance."}</small></span><Icon name="arrow" size={14}/></button><button onClick={() => openReceipt()}><span className="notification-icon"><Icon name="receipt" size={16}/></span><span><strong>Have another receipt?</strong><small>Add one to the demo household.</small></span><Icon name="arrow" size={14}/></button></div>}
          </div></div>
          <button className="add-button" onClick={() => openReceipt()}><Icon name="plus" size={16}/><span>Add receipt</span></button>
        </div>
      </header>
      <div className={`dashboard flow-dashboard ${tab !== "Overview" ? "dashboard-tab" : ""}`} id="overview">
        {tab === "Overview" && <FlowOverview summary={summary} profiles={profiles} transactions={periodTransactions} period={period} settled={settled} menuPerson={menuPerson} onOpenSettlement={() => setModal({ type: "settlement" })} onOpenTransaction={openTransaction} onToggleMenu={(person) => setMenuPerson((current) => current === person ? null : person)} onSeeActivity={openPersonActivity} onAddReceipt={openReceipt} onEditPlan={openPlan} onGoToInsights={() => navigate("Insights")} onGoToAccounts={() => navigate("Accounts")} onCategory={openCategoryActivity}/>}
        {tab === "Activity" && <ActivityView key={`${activityPerson}-${activityCategory}-${activityQuery}`} expenses={periodTransactions} period={period} person={activityPerson} onPersonChange={setActivityPerson} onOpen={openTransaction} initialQuery={activityQuery} initialCategory={activityCategory}/>}
        {tab === "Insights" && <InsightsView summary={summary} sharedExpenses={summary.sharedExpenses} period={period} transactions={periodTransactions} onOpenActivity={() => navigate("Activity")}/>}
        {!["Overview", "Activity", "Insights"].includes(tab) && <DemoSection tab={tab} summary={summary} profiles={profiles} period={period} goalProgress={goalProgress} emailUpdates={emailUpdates} onGoalProgress={() => setGoalProgress((value) => Math.min(100, value + 4))} onEmailUpdates={() => setEmailUpdates((value) => !value)} onRoute={navigate} onReceipt={() => openReceipt()} onEditPlan={openPlan} onPersonActivity={openPersonActivity}/>}
      </div>
    </div>

    {notice && <div className="toast" role="status"><span>✓</span>{notice}<button aria-label="Dismiss message" onClick={() => setNotice("")}><Icon name="close" size={14}/></button></div>}

    {modal && <div className="modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      {modal.type === "receipt" && <section className="modal receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title"><button className="modal-close" onClick={closeModal} aria-label="Close"><Icon name="close"/></button><span className="scan-icon"><Icon name="scan" size={26}/></span><p className="eyebrow">RECEIPT INBOX · DEMO MODE</p><h2 id="receipt-title">Turn a note into a shared expense.</h2><p className="modal-copy">Choose a receipt or bank note. The demo will show editable sample details, then add a pretend transaction to your household ledger.</p><label className={`drop-zone ${fileName ? "has-file" : ""}`}><input type="file" accept="image/*,.pdf" onChange={chooseFile}/><Icon name="receipt" size={25}/><strong>{fileName || "Choose a receipt or bank note"}</strong><small>{fileName ? "Sample details are ready below" : "PNG, JPG or PDF"}</small></label>
        {fileName && <div className="extraction-preview"><div className="extraction-heading"><span className="quiet-mark"/><div><strong>Demo extraction</strong><small>Review these sample details</small></div></div><label><span>Merchant</span><input value={receiptDraft.merchant} onChange={(event) => setReceiptDraft((draft) => ({ ...draft, merchant: event.target.value }))}/></label><div className="extraction-fields"><label><span>Amount</span><input type="number" min="0.01" step="0.01" value={receiptDraft.amount} onChange={(event) => setReceiptDraft((draft) => ({ ...draft, amount: event.target.value }))}/></label><label><span>Paid by</span><select value={receiptDraft.payer} onChange={(event) => setReceiptDraft((draft) => ({ ...draft, payer: event.target.value as PersonName }))}>{people.map((person) => <option key={person}>{person}</option>)}</select></label></div><div className="extraction-fields"><label><span>Category</span><select value={receiptDraft.category} onChange={(event) => setReceiptDraft((draft) => ({ ...draft, category: event.target.value }))}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span>Expense type</span><select value={receiptDraft.shared ? "Shared" : "Personal"} onChange={(event) => setReceiptDraft((draft) => ({ ...draft, shared: event.target.value === "Shared" }))}><option>Shared</option><option>Personal</option></select></label></div></div>}
        <button className="import-button" disabled={!fileName} onClick={importReceipt}>Add to the demo ledger <Icon name="arrow" size={17}/></button><p className="demo-disclaimer">No file leaves this browser. This preview uses sample extracted details.</p></section>}
      {modal.type === "settlement" && <section className="modal settlement-modal" role="dialog" aria-modal="true" aria-labelledby="settlement-title"><button className="modal-close" onClick={closeModal} aria-label="Close"><Icon name="close"/></button><span className="scan-icon"><Icon name="split" size={26}/></span><p className="eyebrow">MONTH-END CHECK-IN</p><h2 id="settlement-title">{settled ? "You’re all square." : "One small settle-up."}</h2><p className="modal-copy">{settled ? `You marked ${period} complete in this demo. No money moved.` : "Based on the shared expenses logged so far, one transfer would bring the shared account back to even."}</p><div className="settlement-summary"><div><span>Lena paid</span><strong>{money(profiles.Lena.paid)}</strong></div><div><span>Noah paid</span><strong>{money(profiles.Noah.paid)}</strong></div></div><div className="transfer-card"><div className="transfer-avatars"><span>L</span><i><Icon name="arrow" size={15}/></i><span>N</span></div><div><small>Suggested transfer</small><strong>{settled ? "Settled for this demo" : `${profiles.Lena.paid - summary.sharedExpenses / 2 >= 0 ? "Noah" : "Lena"} sends ${money(Math.abs(profiles.Lena.paid - summary.sharedExpenses / 2))}`}</strong></div></div><button className="import-button" onClick={() => { if (!settled) { setSettledPeriod(period); notify("Demo settlement marked complete."); } closeModal(); }}>{settled ? "Close settlement" : "Mark this demo as settled"}</button><p className="demo-disclaimer">Demo only: this does not initiate a real bank transfer.</p></section>}
      {modal.type === "transaction" && <section className="modal transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-title"><button className="modal-close" onClick={closeModal} aria-label="Close"><Icon name="close"/></button><span className="scan-icon"><Icon name={modal.expense.icon} size={26}/></span><p className="eyebrow">{modal.expense.added ? "NEW DEMO ENTRY" : "HOUSEHOLD LEDGER"}</p><h2 id="transaction-title">{modal.expense.merchant}</h2><p className="transaction-amount">{money(modal.expense.amount)}</p><div className="transaction-details"><div><span>Paid by</span><strong>{modal.expense.payer}</strong></div><div><span>Date</span><strong>{makeDate(modal.expense, period)}</strong></div><div><span>Category</span><strong>{modal.expense.category}</strong></div><div><span>Type</span><strong>{modal.expense.shared ? "Shared · 50 / 50" : "Personal expense"}</strong></div></div><p className="transaction-note">{modal.expense.note}</p><button className="import-button" onClick={closeModal}>Done</button></section>}
      {modal.type === "plan" && <section className="modal plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-title"><button className="modal-close" onClick={closeModal} aria-label="Close"><Icon name="close"/></button><span className="scan-icon"><Icon name="chart" size={26}/></span><p className="eyebrow">A LITTLE HOUSEHOLD TUNING</p><h2 id="plan-title">Set {modal.person}&apos;s monthly plan.</h2><p className="modal-copy">Give this account a gentle monthly target. The rest of the dashboard updates with your demo number.</p><form onSubmit={savePlan}><label className="plan-input"><span>Monthly target for {period}</span><div><b>€</b><input type="number" min="1" step="0.01" value={planDraft} onChange={(event) => setPlanDraft(event.target.value)}/></div></label><p className="plan-current">Currently recorded: <strong>{money(profiles[modal.person].total)}</strong></p><button className="import-button" type="submit">Save monthly plan <Icon name="arrow" size={17}/></button></form></section>}
    </div>}
  </main>;
}
