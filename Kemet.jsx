import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// KEMET CONNECT — Interactive Prototype
// Mock data only. Designed to demo the full user journey.
// ─────────────────────────────────────────────────────────────────────────────

const GUIDES = [
  {
    id: 1,
    name: "Nour El-Sayed",
    university: "Cairo University",
    major: "Egyptology",
    city: "Cairo",
    coords: { x: 52, y: 38 },
    languages: ["Arabic", "English", "French"],
    specialties: ["Pyramids", "Islamic Cairo", "Museums"],
    bio: "Final-year Egyptology student. I grew up in the shadow of the pyramids and know every cafe in old Cairo worth visiting.",
    rate: 28,
    rating: 4.9,
    reviews: 47,
    avatar: "N",
  },
  {
    id: 2,
    name: "Omar Fathy",
    university: "Alexandria University",
    major: "Tourism Studies",
    city: "Alexandria",
    coords: { x: 44, y: 22 },
    languages: ["Arabic", "English", "Italian"],
    specialties: ["Greco-Roman", "Coastal walks", "Seafood tours"],
    bio: "Born and raised by the Mediterranean. I'll show you the Alexandria that locals love — not the postcards.",
    rate: 22,
    rating: 4.8,
    reviews: 31,
    avatar: "O",
  },
  {
    id: 3,
    name: "Salma Hassan",
    university: "Luxor University",
    major: "Archaeology",
    city: "Luxor",
    coords: { x: 58, y: 64 },
    languages: ["Arabic", "English", "German"],
    specialties: ["Karnak", "Valley of the Kings", "Felucca rides"],
    bio: "I spend my weekends digging at active sites. Let me take you beyond the rope lines and explain what you're actually seeing.",
    rate: 35,
    rating: 5.0,
    reviews: 62,
    avatar: "S",
  },
  {
    id: 4,
    name: "Karim Abdelrahman",
    university: "Aswan University",
    major: "Nubian Heritage",
    city: "Aswan",
    coords: { x: 60, y: 78 },
    languages: ["Arabic", "English", "Nubian"],
    specialties: ["Philae Temple", "Nubian villages", "Nile sailing"],
    bio: "Proud Nubian. I'll bring you home for tea with my grandmother and explain the temples my ancestors built.",
    rate: 25,
    rating: 4.9,
    reviews: 28,
    avatar: "K",
  },
  {
    id: 5,
    name: "Mariam Tawfik",
    university: "Suez Canal University",
    major: "Marine Biology",
    city: "Hurghada",
    coords: { x: 70, y: 50 },
    languages: ["Arabic", "English", "Russian"],
    specialties: ["Diving", "Reef tours", "Desert excursions"],
    bio: "Diver and biologist. Coral reefs by morning, desert stars by night. I'll show you both worlds.",
    rate: 30,
    rating: 4.7,
    reviews: 22,
    avatar: "M",
  },
  {
    id: 6,
    name: "Youssef Mahmoud",
    university: "Cairo University",
    major: "History",
    city: "Cairo",
    coords: { x: 50, y: 40 },
    languages: ["Arabic", "English", "Spanish"],
    specialties: ["Coptic Cairo", "Street food", "Khan el-Khalili"],
    bio: "Third-generation Cairene. Food is my love language — let me feed you through 5,000 years of history.",
    rate: 24,
    rating: 4.8,
    reviews: 39,
    avatar: "Y",
  },
];

const CITIES = ["All cities", "Cairo", "Alexandria", "Luxor", "Aswan", "Hurghada"];
const LANGUAGES_FILTER = ["Any language", "English", "French", "German", "Italian", "Spanish", "Russian"];
const TIME_SLOTS = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–9pm)", "Full Day"];

const MOCK_BOOKINGS = [
  {
    id: "b1",
    guideId: 3,
    date: "2026-06-14",
    slot: "Full Day",
    groupSize: 2,
    status: "accepted",
  },
  {
    id: "b2",
    guideId: 1,
    date: "2026-06-10",
    slot: "Morning (8am–12pm)",
    groupSize: 4,
    status: "pending",
  },
  {
    id: "b3",
    guideId: 6,
    date: "2026-05-02",
    slot: "Evening (5pm–9pm)",
    groupSize: 2,
    status: "completed",
  },
];

const MOCK_MESSAGES = {
  1: [
    { from: "guide", text: "Welcome! Excited to show you Cairo. Any specific sites at the top of your list?", time: "9:14 AM" },
    { from: "me", text: "Definitely the pyramids, but I'd love something off the beaten path too.", time: "9:22 AM" },
    { from: "guide", text: "Perfect — I'll add a stop at Al-Muizz street and a rooftop most tourists miss. Sunset there is unreal.", time: "9:24 AM" },
  ],
  3: [
    { from: "guide", text: "I just confirmed your Full Day for the 14th. Bring a hat — it gets hot fast around Karnak.", time: "Yesterday" },
    { from: "me", text: "Will do, thank you! Any dress code for Valley of the Kings?", time: "Yesterday" },
  ],
  6: [
    { from: "guide", text: "Hope you enjoyed the food tour! Would love a review if you have a minute.", time: "3 weeks ago" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────

export default function KemetConnect() {
  const [page, setPage] = useState("home");
  const [view, setView] = useState("list"); // list | map
  const [filterCity, setFilterCity] = useState("All cities");
  const [filterLang, setFilterLang] = useState("Any language");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingGuide, setBookingGuide] = useState(null);
  const [favorites, setFavorites] = useState([3]);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeChat, setActiveChat] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const toggleFav = (id) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const filteredGuides = useMemo(() => {
    return GUIDES.filter((g) => {
      if (filterCity !== "All cities" && g.city !== filterCity) return false;
      if (filterLang !== "Any language" && !g.languages.includes(filterLang)) return false;
      return true;
    });
  }, [filterCity, filterLang]);

  return (
    <div style={styles.app}>
      <StyleInjector />

      <TopBar page={page} setPage={setPage} favCount={favorites.length} />

      <main style={styles.main}>
        {page === "home" && (
          <HomePage
            view={view}
            setView={setView}
            filterCity={filterCity}
            setFilterCity={setFilterCity}
            filterLang={filterLang}
            setFilterLang={setFilterLang}
            guides={filteredGuides}
            onSelect={setSelectedGuide}
            onBook={setBookingGuide}
            favorites={favorites}
            toggleFav={toggleFav}
          />
        )}
        {page === "trips" && (
          <TripsPage
            bookings={bookings}
            setBookings={setBookings}
            openChat={(gid) => {
              setActiveChat(gid);
              setPage("messages");
            }}
            showToast={showToast}
          />
        )}
        {page === "messages" && (
          <MessagesPage activeChat={activeChat} setActiveChat={setActiveChat} />
        )}
        {page === "favorites" && (
          <FavoritesPage
            favorites={favorites}
            toggleFav={toggleFav}
            onSelect={setSelectedGuide}
            onBook={setBookingGuide}
          />
        )}
        {page === "share" && <SharePage showToast={showToast} />}
      </main>

      {selectedGuide && (
        <GuideModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
          onBook={() => {
            setBookingGuide(selectedGuide);
            setSelectedGuide(null);
          }}
          isFav={favorites.includes(selectedGuide.id)}
          toggleFav={() => toggleFav(selectedGuide.id)}
        />
      )}

      {bookingGuide && (
        <BookingModal
          guide={bookingGuide}
          onClose={() => setBookingGuide(null)}
          onConfirm={(b) => {
            setBookings((prev) => [
              { id: "b" + Date.now(), guideId: bookingGuide.id, ...b, status: "pending" },
              ...prev,
            ]);
            setBookingGuide(null);
            showToast(`Request sent to ${bookingGuide.name}`);
          }}
        />
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP BAR

function TopBar({ page, setPage, favCount }) {
  const tabs = [
    { id: "home", label: "Discover" },
    { id: "trips", label: "My Trips" },
    { id: "messages", label: "Messages" },
    { id: "favorites", label: `Saved${favCount ? ` · ${favCount}` : ""}` },
    { id: "share", label: "Share Links" },
  ];
  return (
    <header style={styles.topbar}>
      <div style={styles.brand}>
        <span style={styles.brandGlyph}>𓂀</span>
        <div>
          <div style={styles.brandName}>Kemet Connect</div>
          <div style={styles.brandTag}>Egypt, with someone who lives it.</div>
        </div>
      </div>
      <nav style={styles.nav}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            style={{
              ...styles.navBtn,
              ...(page === t.id ? styles.navBtnActive : {}),
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div style={styles.user}>
        <div style={styles.userAvatar}>A</div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME

function HomePage({
  view,
  setView,
  filterCity,
  setFilterCity,
  filterLang,
  setFilterLang,
  guides,
  onSelect,
  onBook,
  favorites,
  toggleFav,
}) {
  return (
    <>
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroEyebrow}>Find your host</div>
          <h1 style={styles.heroTitle}>
            Walk Egypt with a<br />
            <em style={styles.heroEm}>student who knows it</em>
          </h1>
          <p style={styles.heroSub}>
            Kemet Hosts are university students across Cairo, Alexandria, Luxor, Aswan, and Hurghada —
            ready to show you the country they grew up in.
          </p>
        </div>
        <div style={styles.heroOrnament}>𓋹 𓊽 𓋹</div>
      </section>

      <section style={styles.controls}>
        <div style={styles.filterRow}>
          <Select value={filterCity} onChange={setFilterCity} options={CITIES} label="City" />
          <Select value={filterLang} onChange={setFilterLang} options={LANGUAGES_FILTER} label="Language" />
          <div style={styles.resultCount}>{guides.length} hosts</div>
        </div>
        <div style={styles.viewToggle}>
          <button
            onClick={() => setView("list")}
            style={{ ...styles.viewBtn, ...(view === "list" ? styles.viewBtnActive : {}) }}
          >
            List
          </button>
          <button
            onClick={() => setView("map")}
            style={{ ...styles.viewBtn, ...(view === "map" ? styles.viewBtnActive : {}) }}
          >
            Map
          </button>
        </div>
      </section>

      {view === "list" ? (
        <section style={styles.grid}>
          {guides.map((g) => (
            <GuideCard
              key={g.id}
              guide={g}
              onSelect={() => onSelect(g)}
              onBook={() => onBook(g)}
              isFav={favorites.includes(g.id)}
              toggleFav={() => toggleFav(g.id)}
            />
          ))}
          {guides.length === 0 && (
            <div style={styles.empty}>No hosts match those filters yet. Try widening your search.</div>
          )}
        </section>
      ) : (
        <MapView guides={guides} onSelect={onSelect} />
      )}
    </>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <label style={styles.selectWrap}>
      <span style={styles.selectLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function GuideCard({ guide, onSelect, onBook, isFav, toggleFav }) {
  return (
    <article style={styles.card} onClick={onSelect}>
      <div style={styles.cardTop}>
        <div style={styles.avatar}>{guide.avatar}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav();
          }}
          style={{ ...styles.favBtn, ...(isFav ? styles.favBtnActive : {}) }}
          aria-label="Save"
        >
          {isFav ? "♥" : "♡"}
        </button>
      </div>
      <h3 style={styles.cardName}>{guide.name}</h3>
      <div style={styles.cardMeta}>
        {guide.major} · {guide.university}
      </div>
      <div style={styles.cardCity}>
        <span style={styles.cityDot} />
        {guide.city}
      </div>
      <p style={styles.cardBio}>{guide.bio}</p>
      <div style={styles.tags}>
        {guide.specialties.slice(0, 3).map((s) => (
          <span key={s} style={styles.tag}>
            {s}
          </span>
        ))}
      </div>
      <div style={styles.cardFooter}>
        <div>
          <div style={styles.rate}>
            ${guide.rate}
            <span style={styles.rateUnit}>/hr</span>
          </div>
          <div style={styles.rating}>
            ★ {guide.rating} <span style={styles.reviewCount}>({guide.reviews})</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          style={styles.bookBtn}
        >
          Book
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP VIEW (stylized — no real Leaflet here, but evokes the same UX)

function MapView({ guides, onSelect }) {
  const [popupGuide, setPopupGuide] = useState(null);

  return (
    <section style={styles.mapWrap}>
      <div style={styles.mapBg}>
        {/* Nile river suggestion */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.mapSvg}>
          <defs>
            <linearGradient id="nile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a6a7a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2c4a55" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M 55 12 Q 50 30 56 50 Q 60 70 58 95"
            stroke="url(#nile)"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Mediterranean */}
          <rect x="0" y="0" width="100" height="14" fill="#3a6a7a" opacity="0.18" />
          {/* Red Sea */}
          <path d="M 78 30 Q 82 55 76 90 L 100 90 L 100 30 Z" fill="#3a6a7a" opacity="0.18" />
        </svg>

        {/* User location pulse */}
        <div style={{ ...styles.mapPin, left: "51%", top: "39%" }}>
          <div style={styles.userPulse} />
          <div style={styles.userDot} />
        </div>

        {/* Guide markers */}
        {guides.map((g) => (
          <button
            key={g.id}
            onClick={() => setPopupGuide(g)}
            style={{
              ...styles.mapMarker,
              left: `${g.coords.x}%`,
              top: `${g.coords.y}%`,
            }}
            aria-label={g.name}
          >
            <span style={styles.markerInner}>{g.avatar}</span>
          </button>
        ))}

        {/* City labels */}
        {[
          { name: "Cairo", x: 51, y: 36 },
          { name: "Alexandria", x: 44, y: 20 },
          { name: "Luxor", x: 58, y: 62 },
          { name: "Aswan", x: 60, y: 76 },
          { name: "Hurghada", x: 70, y: 48 },
        ].map((c) => (
          <span
            key={c.name}
            style={{
              ...styles.cityLabel,
              left: `${c.x + 3}%`,
              top: `${c.y - 1}%`,
            }}
          >
            {c.name}
          </span>
        ))}

        {popupGuide && (
          <div
            style={{
              ...styles.mapPopup,
              left: `${Math.min(popupGuide.coords.x, 65)}%`,
              top: `${Math.max(popupGuide.coords.y - 18, 5)}%`,
            }}
          >
            <button onClick={() => setPopupGuide(null)} style={styles.popupClose}>
              ×
            </button>
            <div style={styles.popupTop}>
              <div style={styles.avatarSm}>{popupGuide.avatar}</div>
              <div>
                <div style={styles.popupName}>{popupGuide.name}</div>
                <div style={styles.popupMeta}>
                  {popupGuide.city} · ★ {popupGuide.rating}
                </div>
              </div>
            </div>
            <button onClick={() => onSelect(popupGuide)} style={styles.popupBtn}>
              View profile
            </button>
          </div>
        )}
      </div>

      <div style={styles.mapLegend}>
        <span style={styles.legendItem}>
          <span style={styles.legendDotOrange} /> Available host
        </span>
        <span style={styles.legendItem}>
          <span style={styles.legendDotBlue} /> You are here
        </span>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE MODAL

function GuideModal({ guide, onClose, onBook, isFav, toggleFav }) {
  const [tab, setTab] = useState("about");
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.modalClose}>
          ×
        </button>
        <div style={styles.modalHead}>
          <div style={styles.avatarLg}>{guide.avatar}</div>
          <div style={{ flex: 1 }}>
            <h2 style={styles.modalName}>{guide.name}</h2>
            <div style={styles.modalSubtle}>
              {guide.major} · {guide.university}
            </div>
            <div style={styles.modalCity}>
              <span style={styles.cityDot} />
              {guide.city}, Egypt
            </div>
            <div style={styles.modalRating}>
              ★ {guide.rating} <span style={styles.reviewCount}>({guide.reviews} reviews)</span>
            </div>
          </div>
          <button onClick={toggleFav} style={{ ...styles.favBtnLg, ...(isFav ? styles.favBtnActive : {}) }}>
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        <div style={styles.tabs}>
          {["about", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            >
              {t === "about" ? "About" : "Reviews"}
            </button>
          ))}
        </div>

        {tab === "about" ? (
          <div style={styles.modalBody}>
            <p style={styles.modalBio}>{guide.bio}</p>
            <div style={styles.statBlock}>
              <Stat label="Languages" value={guide.languages.join(", ")} />
              <Stat label="Specialties" value={guide.specialties.join(", ")} />
              <Stat label="Rate" value={`$${guide.rate}/hour`} />
            </div>
          </div>
        ) : (
          <div style={styles.modalBody}>
            <Review
              name="Hannah · Germany"
              stars={5}
              text="Salma made the Valley of the Kings unforgettable. She knew which tombs had the best preserved paintings and explained the symbolism in a way that actually stuck with me."
            />
            <Review
              name="Marco · Italy"
              stars={5}
              text="A real local experience. We ended the day on a felucca at sunset with tea her uncle made."
            />
            <Review
              name="Sophie · France"
              stars={4}
              text="Very knowledgeable and patient with all my questions about hieroglyphs. Would book again."
            />
          </div>
        )}

        <div style={styles.modalFooter}>
          <button onClick={onBook} style={styles.bookBtnLg}>
            Request booking
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Review({ name, stars, text }) {
  return (
    <div style={styles.review}>
      <div style={styles.reviewHead}>
        <span style={styles.reviewName}>{name}</span>
        <span style={styles.reviewStars}>{"★".repeat(stars)}</span>
      </div>
      <p style={styles.reviewText}>{text}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING MODAL

function BookingModal({ guide, onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [size, setSize] = useState(2);

  const handleConfirm = () => {
    if (!date) return;
    onConfirm({ date, slot, groupSize: size });
  };

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.modalClose}>
          ×
        </button>
        <div style={styles.bookHead}>
          <div style={styles.eyebrow}>Book a tour</div>
          <h2 style={styles.modalName}>with {guide.name}</h2>
          <div style={styles.modalSubtle}>
            {guide.city} · ${guide.rate}/hr
          </div>
        </div>

        <div style={styles.formBlock}>
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />
          </Field>
          <Field label="Time slot">
            <div style={styles.slotGrid}>
              {TIME_SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  style={{ ...styles.slotBtn, ...(slot === s ? styles.slotBtnActive : {}) }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Group size">
            <div style={styles.sizeRow}>
              <button onClick={() => setSize(Math.max(1, size - 1))} style={styles.sizeBtn}>
                −
              </button>
              <span style={styles.sizeNum}>{size}</span>
              <button onClick={() => setSize(size + 1)} style={styles.sizeBtn}>
                +
              </button>
            </div>
          </Field>
        </div>

        <div style={styles.modalFooter}>
          <button
            onClick={handleConfirm}
            disabled={!date}
            style={{ ...styles.bookBtnLg, ...(date ? {} : styles.bookBtnDisabled) }}
          >
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={styles.field}>
      <div style={styles.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIPS PAGE

function TripsPage({ bookings, setBookings, openChat, showToast }) {
  const [reviewing, setReviewing] = useState(null);

  const update = (id, status) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    showToast(`Booking ${status}`);
  };

  return (
    <section style={styles.pageWrap}>
      <PageHeader title="My Trips" subtitle="Track requests, upcoming tours, and past experiences." />
      <div style={styles.tripList}>
        {bookings.length === 0 && (
          <div style={styles.empty}>You haven't requested any tours yet.</div>
        )}
        {bookings.map((b) => {
          const guide = GUIDES.find((g) => g.id === b.guideId);
          return (
            <div key={b.id} style={styles.tripCard}>
              <div style={styles.avatarMd}>{guide.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.tripName}>{guide.name}</div>
                <div style={styles.tripMeta}>
                  {guide.city} · {b.date} · {b.slot} · party of {b.groupSize}
                </div>
              </div>
              <StatusBadge status={b.status} />
              <div style={styles.tripActions}>
                <button onClick={() => openChat(guide.id)} style={styles.linkBtn}>
                  Message
                </button>
                {b.status === "pending" && (
                  <button onClick={() => update(b.id, "accepted")} style={styles.linkBtn}>
                    Mark accepted
                  </button>
                )}
                {b.status === "accepted" && (
                  <button onClick={() => update(b.id, "completed")} style={styles.linkBtn}>
                    Mark completed
                  </button>
                )}
                {b.status === "completed" && (
                  <button onClick={() => setReviewing(guide)} style={styles.linkBtn}>
                    Leave review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {reviewing && (
        <ReviewModal
          guide={reviewing}
          onClose={() => setReviewing(null)}
          onSubmit={() => {
            setReviewing(null);
            showToast("Review submitted — thank you!");
          }}
        />
      )}
    </section>
  );
}

function StatusBadge({ status }) {
  const styleMap = {
    pending: { bg: "#f4e4c1", color: "#8a6720" },
    accepted: { bg: "#d8e8d4", color: "#3a5a32" },
    completed: { bg: "#e2d9cc", color: "#5a4a36" },
    declined: { bg: "#e8d0c8", color: "#7a3a2a" },
  };
  const s = styleMap[status] || styleMap.pending;
  return (
    <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function ReviewModal({ guide, onClose, onSubmit }) {
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={{ ...styles.modal, maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.modalClose}>
          ×
        </button>
        <div style={styles.bookHead}>
          <div style={styles.eyebrow}>How was your tour?</div>
          <h2 style={styles.modalName}>Review {guide.name}</h2>
        </div>
        <div style={styles.formBlock}>
          <Field label="Rating">
            <div style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setStars(n)}
                  style={{ ...styles.starBtn, color: n <= stars ? "#c9952a" : "#d6cbb6" }}
                >
                  ★
                </button>
              ))}
            </div>
          </Field>
          <Field label="Your experience">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="What stood out? What would you tell another traveler?"
              style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }}
            />
          </Field>
        </div>
        <div style={styles.modalFooter}>
          <button onClick={onSubmit} style={styles.bookBtnLg}>
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGES

function MessagesPage({ activeChat, setActiveChat }) {
  const conversations = Object.keys(MOCK_MESSAGES).map((id) => {
    const guide = GUIDES.find((g) => g.id === +id);
    const msgs = MOCK_MESSAGES[id];
    return { guide, last: msgs[msgs.length - 1] };
  });
  const guide = activeChat ? GUIDES.find((g) => g.id === activeChat) : null;
  const messages = activeChat ? MOCK_MESSAGES[activeChat] || [] : [];

  return (
    <section style={styles.pageWrap}>
      <PageHeader title="Messages" subtitle="Conversations with your hosts." />
      <div style={styles.messagesLayout}>
        <div style={styles.convList}>
          {conversations.map((c) => (
            <button
              key={c.guide.id}
              onClick={() => setActiveChat(c.guide.id)}
              style={{
                ...styles.convItem,
                ...(activeChat === c.guide.id ? styles.convItemActive : {}),
              }}
            >
              <div style={styles.avatarMd}>{c.guide.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.convName}>{c.guide.name}</div>
                <div style={styles.convPreview}>{c.last.text}</div>
              </div>
              <div style={styles.convTime}>{c.last.time}</div>
            </button>
          ))}
        </div>
        <div style={styles.chatPane}>
          {!guide ? (
            <div style={styles.chatEmpty}>Select a conversation to read.</div>
          ) : (
            <>
              <div style={styles.chatHead}>
                <div style={styles.avatarSm}>{guide.avatar}</div>
                <div>
                  <div style={styles.chatName}>{guide.name}</div>
                  <div style={styles.chatMeta}>{guide.city}</div>
                </div>
              </div>
              <div style={styles.chatBody}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.bubble,
                      ...(m.from === "me" ? styles.bubbleMe : styles.bubbleThem),
                    }}
                  >
                    <div>{m.text}</div>
                    <div style={styles.bubbleTime}>{m.time}</div>
                  </div>
                ))}
              </div>
              <div style={styles.chatInputRow}>
                <input placeholder="Write a message…" style={{ ...styles.input, flex: 1 }} />
                <button style={styles.sendBtn}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES

function FavoritesPage({ favorites, toggleFav, onSelect, onBook }) {
  const list = GUIDES.filter((g) => favorites.includes(g.id));
  return (
    <section style={styles.pageWrap}>
      <PageHeader title="Saved hosts" subtitle="Your shortlist for future trips." />
      {list.length === 0 ? (
        <div style={styles.empty}>You haven't saved any hosts yet. Tap the heart on a profile to save.</div>
      ) : (
        <div style={styles.grid}>
          {list.map((g) => (
            <GuideCard
              key={g.id}
              guide={g}
              onSelect={() => onSelect(g)}
              onBook={() => onBook(g)}
              isFav={true}
              toggleFav={() => toggleFav(g.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE LINKS

function SharePage({ showToast }) {
  const [links, setLinks] = useState([
    { code: "luxor-salma", target: "Salma Hassan · profile", clicks: 24, expires: "2026-08-01" },
    { code: "cairo-pyramids", target: "Cairo search results", clicks: 89, expires: "—" },
  ]);
  const [code, setCode] = useState("");

  const add = () => {
    if (!code) return;
    setLinks([{ code, target: "Custom search", clicks: 0, expires: "—" }, ...links]);
    setCode("");
    showToast("Short link created");
  };

  return (
    <section style={styles.pageWrap}>
      <PageHeader title="Share Links" subtitle="Custom short URLs with click tracking." />
      <div style={styles.shareInputRow}>
        <span style={styles.sharePrefix}>kemet.co/s/</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s+/g, "-").toLowerCase())}
          placeholder="your-custom-code"
          style={{ ...styles.input, flex: 1 }}
        />
        <button onClick={add} style={styles.bookBtn}>
          Create
        </button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Short URL</th>
            <th style={styles.th}>Destination</th>
            <th style={styles.th}>Clicks</th>
            <th style={styles.th}>Expires</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
            <tr key={l.code} style={styles.tr}>
              <td style={styles.td}>kemet.co/s/{l.code}</td>
              <td style={styles.td}>{l.target}</td>
              <td style={styles.td}>{l.clicks}</td>
              <td style={styles.td}>{l.expires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div style={styles.pageHeader}>
      <h1 style={styles.pageTitle}>{title}</h1>
      <p style={styles.pageSubtitle}>{subtitle}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES (Google Fonts via link injection)

function StyleInjector() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      input, select, textarea, button { font-family: inherit; }
      button { cursor: pointer; border: none; background: none; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #c9b896; border-radius: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES — papyrus tones, gold accent, hieroglyph-influenced detailing

const palette = {
  bg: "#f5ede0",
  bgWarm: "#efe3cf",
  ink: "#2a2418",
  inkSoft: "#5a4f3e",
  gold: "#c9952a",
  goldDeep: "#a3761d",
  terra: "#c25a3a",
  paper: "#fbf6ec",
  line: "#d9cdb4",
  midnight: "#1f1a12",
};

const display = "'Cormorant Garamond', Georgia, serif";
const sans = "'Inter', -apple-system, sans-serif";

const styles = {
  app: {
    minHeight: "100vh",
    background: `radial-gradient(ellipse at top, ${palette.paper}, ${palette.bg} 60%, ${palette.bgWarm})`,
    color: palette.ink,
    fontFamily: sans,
    fontSize: 14,
    paddingBottom: 80,
  },
  main: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 32px",
  },

  // TOP BAR
  topbar: {
    display: "flex",
    alignItems: "center",
    gap: 32,
    padding: "20px 32px",
    borderBottom: `1px solid ${palette.line}`,
    background: `linear-gradient(to bottom, ${palette.paper}, transparent)`,
  },
  brand: { display: "flex", alignItems: "center", gap: 14, flexShrink: 0 },
  brandGlyph: {
    fontSize: 36,
    color: palette.gold,
    lineHeight: 1,
  },
  brandName: {
    fontFamily: display,
    fontSize: 22,
    fontWeight: 600,
    color: palette.ink,
    letterSpacing: 0.3,
  },
  brandTag: {
    fontSize: 11,
    color: palette.inkSoft,
    fontStyle: "italic",
    letterSpacing: 0.2,
  },
  nav: { display: "flex", gap: 4, flex: 1, justifyContent: "center", flexWrap: "wrap" },
  navBtn: {
    padding: "8px 14px",
    fontSize: 13,
    color: palette.inkSoft,
    borderRadius: 6,
    transition: "all 0.15s",
    fontWeight: 500,
  },
  navBtnActive: {
    color: palette.ink,
    background: palette.paper,
    boxShadow: `inset 0 -2px 0 ${palette.gold}`,
  },
  user: { flexShrink: 0 },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.gold}, ${palette.goldDeep})`,
    color: palette.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: display,
    fontWeight: 600,
    fontSize: 16,
  },

  // HERO
  hero: {
    padding: "56px 0 40px",
    position: "relative",
    textAlign: "center",
  },
  heroInner: { maxWidth: 720, margin: "0 auto" },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: palette.goldDeep,
    marginBottom: 16,
    fontWeight: 600,
  },
  heroTitle: {
    fontFamily: display,
    fontSize: 56,
    lineHeight: 1.05,
    margin: 0,
    fontWeight: 500,
    color: palette.ink,
    letterSpacing: -0.5,
  },
  heroEm: {
    color: palette.terra,
    fontStyle: "italic",
    fontWeight: 500,
  },
  heroSub: {
    fontSize: 16,
    color: palette.inkSoft,
    marginTop: 20,
    lineHeight: 1.6,
    maxWidth: 540,
    marginLeft: "auto",
    marginRight: "auto",
  },
  heroOrnament: {
    marginTop: 28,
    fontSize: 20,
    color: palette.gold,
    letterSpacing: 12,
    opacity: 0.7,
  },

  // CONTROLS
  controls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 20,
    padding: "24px 0 28px",
    borderTop: `1px solid ${palette.line}`,
  },
  filterRow: { display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" },
  selectWrap: { display: "flex", flexDirection: "column", gap: 4 },
  selectLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: palette.inkSoft,
    fontWeight: 600,
  },
  select: {
    padding: "10px 14px",
    background: palette.paper,
    border: `1px solid ${palette.line}`,
    borderRadius: 6,
    fontSize: 14,
    color: palette.ink,
    minWidth: 160,
    cursor: "pointer",
  },
  resultCount: {
    fontFamily: display,
    fontSize: 18,
    fontStyle: "italic",
    color: palette.inkSoft,
    paddingBottom: 6,
  },
  viewToggle: {
    display: "flex",
    background: palette.paper,
    border: `1px solid ${palette.line}`,
    borderRadius: 8,
    padding: 3,
  },
  viewBtn: {
    padding: "8px 18px",
    fontSize: 13,
    color: palette.inkSoft,
    borderRadius: 5,
    fontWeight: 500,
  },
  viewBtnActive: {
    background: palette.ink,
    color: palette.paper,
  },

  // GRID + CARD
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
    paddingBottom: 60,
  },
  card: {
    background: palette.paper,
    border: `1px solid ${palette.line}`,
    borderRadius: 10,
    padding: 22,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.terra}, ${palette.goldDeep})`,
    color: palette.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: display,
    fontWeight: 600,
    fontSize: 22,
  },
  avatarSm: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.terra}, ${palette.goldDeep})`,
    color: palette.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: display,
    fontWeight: 600,
    fontSize: 16,
    flexShrink: 0,
  },
  avatarMd: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.terra}, ${palette.goldDeep})`,
    color: palette.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: display,
    fontWeight: 600,
    fontSize: 18,
    flexShrink: 0,
  },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.terra}, ${palette.goldDeep})`,
    color: palette.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: display,
    fontWeight: 600,
    fontSize: 30,
    flexShrink: 0,
  },
  favBtn: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: palette.bg,
    border: `1px solid ${palette.line}`,
    color: palette.inkSoft,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  favBtnLg: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: palette.bg,
    border: `1px solid ${palette.line}`,
    color: palette.inkSoft,
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  favBtnActive: {
    background: palette.terra,
    color: palette.paper,
    borderColor: palette.terra,
  },
  cardName: {
    fontFamily: display,
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 4px",
    color: palette.ink,
  },
  cardMeta: {
    fontSize: 12,
    color: palette.inkSoft,
    marginBottom: 10,
  },
  cardCity: {
    fontSize: 12,
    color: palette.goldDeep,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  cityDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: palette.gold,
    display: "inline-block",
  },
  cardBio: {
    fontSize: 13.5,
    color: palette.inkSoft,
    lineHeight: 1.55,
    margin: "0 0 14px",
    flex: 1,
  },
  tags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 },
  tag: {
    fontSize: 11,
    padding: "4px 10px",
    background: palette.bgWarm,
    color: palette.inkSoft,
    borderRadius: 99,
    border: `1px solid ${palette.line}`,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 14,
    borderTop: `1px dashed ${palette.line}`,
  },
  rate: {
    fontFamily: display,
    fontSize: 24,
    fontWeight: 600,
    color: palette.ink,
    lineHeight: 1,
  },
  rateUnit: { fontSize: 12, color: palette.inkSoft, fontFamily: sans, fontWeight: 400 },
  rating: { fontSize: 12, color: palette.goldDeep, marginTop: 4, fontWeight: 600 },
  reviewCount: { color: palette.inkSoft, fontWeight: 400 },
  bookBtn: {
    background: palette.ink,
    color: palette.paper,
    padding: "10px 20px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.3,
    transition: "background 0.15s",
  },
  bookBtnLg: {
    background: palette.ink,
    color: palette.paper,
    padding: "14px 28px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.5,
    width: "100%",
  },
  bookBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },

  // MAP
  mapWrap: { paddingBottom: 60 },
  mapBg: {
    position: "relative",
    height: 580,
    background: `linear-gradient(180deg, #ead7b3 0%, #d9c094 100%)`,
    borderRadius: 12,
    border: `1px solid ${palette.line}`,
    overflow: "hidden",
    boxShadow: "inset 0 0 60px rgba(120, 90, 40, 0.15)",
  },
  mapSvg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
  mapPin: { position: "absolute", transform: "translate(-50%, -50%)" },
  userPulse: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#3a7bd5",
    opacity: 0.3,
    transform: "translate(-50%, -50%)",
    animation: "pulse 2s infinite",
  },
  userDot: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: "#3a7bd5",
    border: "2px solid white",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  mapMarker: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${palette.terra}, ${palette.goldDeep})`,
    border: `2px solid ${palette.paper}`,
    boxShadow: "0 3px 10px rgba(80, 50, 20, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: palette.paper,
    fontFamily: display,
    fontWeight: 600,
    fontSize: 14,
    animation: "markerBob 3s ease-in-out infinite",
  },
  markerInner: {},
  cityLabel: {
    position: "absolute",
    fontFamily: display,
    fontSize: 14,
    fontStyle: "italic",
    color: palette.midnight,
    opacity: 0.6,
    pointerEvents: "none",
    letterSpacing: 0.5,
  },
  mapPopup: {
    position: "absolute",
    transform: "translateX(-50%)",
    width: 220,
    background: palette.paper,
    borderRadius: 10,
    padding: 14,
    boxShadow: "0 12px 32px rgba(60, 40, 10, 0.25)",
    border: `1px solid ${palette.line}`,
  },
  popupClose: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 18,
    color: palette.inkSoft,
    width: 22,
    height: 22,
  },
  popupTop: { display: "flex", gap: 10, alignItems: "center", marginBottom: 12 },
  popupName: { fontFamily: display, fontSize: 17, fontWeight: 600 },
  popupMeta: { fontSize: 12, color: palette.inkSoft, marginTop: 2 },
  popupBtn: {
    width: "100%",
    padding: "8px 12px",
    background: palette.ink,
    color: palette.paper,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  mapLegend: {
    display: "flex",
    gap: 20,
    marginTop: 14,
    fontSize: 12,
    color: palette.inkSoft,
  },
  legendItem: { display: "flex", alignItems: "center", gap: 8 },
  legendDotOrange: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: palette.terra,
  },
  legendDotBlue: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#3a7bd5",
  },

  // MODAL
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(30, 20, 10, 0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
  },
  modal: {
    background: palette.paper,
    borderRadius: 14,
    maxWidth: 640,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 30px 80px rgba(40, 20, 5, 0.4)",
    border: `1px solid ${palette.line}`,
  },
  modalClose: {
    position: "absolute",
    top: 14,
    right: 16,
    fontSize: 26,
    color: palette.inkSoft,
    width: 32,
    height: 32,
    zIndex: 2,
  },
  modalHead: {
    display: "flex",
    gap: 18,
    padding: "28px 28px 20px",
    alignItems: "flex-start",
  },
  modalName: {
    fontFamily: display,
    fontSize: 30,
    fontWeight: 600,
    margin: "0 0 6px",
    color: palette.ink,
    lineHeight: 1.1,
  },
  modalSubtle: { fontSize: 13, color: palette.inkSoft, marginBottom: 8 },
  modalCity: {
    fontSize: 11,
    color: palette.goldDeep,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  modalRating: { fontSize: 13, color: palette.goldDeep, fontWeight: 600 },
  tabs: {
    display: "flex",
    gap: 4,
    padding: "0 28px",
    borderBottom: `1px solid ${palette.line}`,
  },
  tab: {
    padding: "12px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: palette.inkSoft,
    letterSpacing: 0.5,
  },
  tabActive: {
    color: palette.ink,
    boxShadow: `inset 0 -2px 0 ${palette.gold}`,
  },
  modalBody: { padding: "24px 28px" },
  modalBio: {
    fontSize: 15,
    lineHeight: 1.7,
    color: palette.ink,
    margin: "0 0 24px",
    fontFamily: display,
    fontStyle: "italic",
  },
  statBlock: { display: "flex", flexDirection: "column", gap: 14 },
  stat: { borderTop: `1px dashed ${palette.line}`, paddingTop: 14 },
  statLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: palette.inkSoft,
    fontWeight: 600,
    marginBottom: 4,
  },
  statValue: { fontSize: 14, color: palette.ink },
  review: {
    borderTop: `1px dashed ${palette.line}`,
    paddingTop: 16,
    marginBottom: 16,
  },
  reviewHead: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reviewName: { fontSize: 13, fontWeight: 600, color: palette.ink },
  reviewStars: { color: palette.gold, fontSize: 13 },
  reviewText: {
    fontSize: 13.5,
    color: palette.inkSoft,
    lineHeight: 1.6,
    margin: 0,
  },
  modalFooter: { padding: "0 28px 28px" },

  // BOOKING
  bookHead: { padding: "28px 28px 12px" },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: palette.goldDeep,
    fontWeight: 600,
    marginBottom: 10,
  },
  formBlock: { padding: "16px 28px 24px" },
  field: { marginBottom: 22 },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: palette.inkSoft,
    fontWeight: 600,
    marginBottom: 10,
  },
  input: {
    padding: "12px 14px",
    background: palette.bg,
    border: `1px solid ${palette.line}`,
    borderRadius: 6,
    fontSize: 14,
    color: palette.ink,
    width: "100%",
    outline: "none",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
  },
  slotBtn: {
    padding: "12px 10px",
    background: palette.bg,
    border: `1px solid ${palette.line}`,
    borderRadius: 6,
    fontSize: 13,
    color: palette.inkSoft,
    textAlign: "center",
    transition: "all 0.15s",
  },
  slotBtnActive: {
    background: palette.ink,
    color: palette.paper,
    borderColor: palette.ink,
  },
  sizeRow: { display: "flex", alignItems: "center", gap: 16 },
  sizeBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    background: palette.bg,
    border: `1px solid ${palette.line}`,
    fontSize: 18,
    color: palette.ink,
  },
  sizeNum: {
    fontFamily: display,
    fontSize: 22,
    fontWeight: 600,
    minWidth: 30,
    textAlign: "center",
  },
  starRow: { display: "flex", gap: 6 },
  starBtn: { fontSize: 32, lineHeight: 1 },

  // PAGES
  pageWrap: { paddingTop: 36, paddingBottom: 60 },
  pageHeader: {
    paddingBottom: 28,
    borderBottom: `1px solid ${palette.line}`,
    marginBottom: 28,
  },
  pageTitle: {
    fontFamily: display,
    fontSize: 42,
    fontWeight: 500,
    margin: "0 0 6px",
    letterSpacing: -0.3,
  },
  pageSubtitle: { fontSize: 14, color: palette.inkSoft, margin: 0 },

  // TRIPS
  tripList: { display: "flex", flexDirection: "column", gap: 12 },
  tripCard: {
    background: palette.paper,
    border: `1px solid ${palette.line}`,
    borderRadius: 10,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  tripName: {
    fontFamily: display,
    fontSize: 19,
    fontWeight: 600,
    marginBottom: 2,
  },
  tripMeta: { fontSize: 13, color: palette.inkSoft },
  badge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 99,
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  tripActions: { display: "flex", gap: 6, flexWrap: "wrap" },
  linkBtn: {
    padding: "6px 12px",
    fontSize: 12,
    color: palette.ink,
    border: `1px solid ${palette.line}`,
    borderRadius: 5,
    background: palette.bg,
    fontWeight: 500,
  },
  empty: {
    padding: "40px 20px",
    textAlign: "center",
    color: palette.inkSoft,
    fontStyle: "italic",
    fontFamily: display,
    fontSize: 17,
    gridColumn: "1 / -1",
  },

  // MESSAGES
  messagesLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 0,
    background: palette.paper,
    border: `1px solid ${palette.line}`,
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 540,
  },
  convList: {
    borderRight: `1px solid ${palette.line}`,
    background: palette.bg,
    display: "flex",
    flexDirection: "column",
  },
  convItem: {
    display: "flex",
    gap: 12,
    padding: "16px 18px",
    alignItems: "center",
    textAlign: "left",
    borderBottom: `1px solid ${palette.line}`,
    width: "100%",
  },
  convItemActive: { background: palette.paper },
  convName: { fontSize: 14, fontWeight: 600, color: palette.ink, marginBottom: 2 },
  convPreview: {
    fontSize: 12,
    color: palette.inkSoft,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  convTime: { fontSize: 11, color: palette.inkSoft, flexShrink: 0 },
  chatPane: { display: "flex", flexDirection: "column" },
  chatEmpty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: palette.inkSoft,
    fontStyle: "italic",
    fontFamily: display,
    fontSize: 16,
  },
  chatHead: {
    padding: "16px 20px",
    borderBottom: `1px solid ${palette.line}`,
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  chatName: { fontFamily: display, fontSize: 18, fontWeight: 600 },
  chatMeta: { fontSize: 12, color: palette.inkSoft },
  chatBody: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    minHeight: 320,
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
  },
  bubbleMe: {
    background: palette.ink,
    color: palette.paper,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    background: palette.bgWarm,
    color: palette.ink,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  bubbleTime: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
  },
  chatInputRow: {
    padding: 16,
    borderTop: `1px solid ${palette.line}`,
    display: "flex",
    gap: 10,
  },
  sendBtn: {
    background: palette.ink,
    color: palette.paper,
    padding: "0 22px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
  },

  // SHARE
  shareInputRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 24,
    background: palette.paper,
    padding: 16,
    borderRadius: 10,
    border: `1px solid ${palette.line}`,
  },
  sharePrefix: {
    fontFamily: display,
    fontSize: 16,
    color: palette.inkSoft,
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: palette.paper,
    borderRadius: 10,
    overflow: "hidden",
    border: `1px solid ${palette.line}`,
  },
  th: {
    textAlign: "left",
    padding: "14px 18px",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: palette.inkSoft,
    fontWeight: 600,
    borderBottom: `1px solid ${palette.line}`,
    background: palette.bg,
  },
  tr: {},
  td: {
    padding: "14px 18px",
    fontSize: 13.5,
    color: palette.ink,
    borderBottom: `1px solid ${palette.line}`,
  },

  // TOAST
  toast: {
    position: "fixed",
    bottom: 28,
    left: "50%",
    transform: "translateX(-50%)",
    background: palette.midnight,
    color: palette.paper,
    padding: "12px 22px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    zIndex: 200,
    animation: "toastIn 0.25s ease-out",
  },
};

// Inject keyframes
if (typeof document !== "undefined" && !document.getElementById("kc-keyframes")) {
  const s = document.createElement("style");
  s.id = "kc-keyframes";
  s.textContent = `
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
      50% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    }
    @keyframes markerBob {
      0%, 100% { transform: translate(-50%, -50%) translateY(0); }
      50% { transform: translate(-50%, -50%) translateY(-3px); }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translate(-50%, 10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @media (max-width: 768px) {
      .kc-hero-title { font-size: 38px !important; }
    }
  `;
  document.head.appendChild(s);
}
