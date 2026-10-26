import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Building2,
  Clock,
  Users,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';

const campusZones = [
  {
    id: 'zone-a',
    code: 'ZONE-A',
    name: 'Central Academic Commons',
    building: 'Main Library Complex • Wing A & B',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
    description:
      'The intellectual epicenter of campus featuring 24/7 silent study zones, sound-damped team pods, and multimedia archives.',
    facilities: [
      {
        name: 'Library Acoustic Study Room (Pod 4)',
        type: 'Study Space',
        capacity: '4 Students',
        hours: '08:00 - 22:00',
        fee: 'Free',
        amenities: ['Acoustic Dampening', '4K Whiteboard', 'Gigabit Wi-Fi 6', 'Power Hubs'],
      },
    ],
    coordinates: 'Grid B-4 • North Promenade',
    accessProtocol: 'Student NFC / Mobile QR Pass required at turnstile',
  },
  {
    id: 'zone-b',
    code: 'ZONE-B',
    name: 'Alan Turing Innovation Hall',
    building: 'Computer Science & AI Institute • Level 3',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    description:
      'High-performance compute labs equipped with dual-monitor RTX workstations, FPGA boards, and isolated gigabit test networks.',
    facilities: [
      {
        name: 'Computer Lab Workstation (Station 12)',
        type: 'Computing & Research',
        capacity: '1 Student',
        hours: '09:00 - 21:00',
        fee: '$5 / session',
        amenities: ['NVIDIA RTX Workstation', 'Dual 4K Displays', 'Linux & CUDA Env', 'Fast Ethernet'],
      },
    ],
    coordinates: 'Grid C-2 • Tech Quadrangle',
    accessProtocol: 'Departmental auth or faculty project reservation',
  },
  {
    id: 'zone-c',
    code: 'ZONE-C',
    name: 'Phoenix Athletic Complex',
    building: 'Varsity Fieldhouse & Sports Pavilion',
    image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&w=1000&q=80',
    description:
      'Premier indoor multi-court facility supporting collegiate badminton, squash tournaments, and physical wellness.',
    facilities: [
      {
        name: 'Indoor Badminton Court 2',
        type: 'Athletics & Recreation',
        capacity: '4 Players',
        hours: '06:00 - 22:00',
        fee: '$10 / court',
        amenities: ['Olympic Sprung Timber', 'Yonex Tournament Nets', 'Locker Facilities', 'Water Stations'],
      },
    ],
    coordinates: 'Grid D-6 • South Campus Blvd',
    accessProtocol: 'Court non-marking shoes required; advance reservation only',
  },
  {
    id: 'zone-d',
    code: 'ZONE-D',
    name: 'Srinivasa Ramanujan Auditorium',
    building: 'Performing Arts & Convocation Center',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    description:
      '450-seat tiered auditorium with studio-grade acoustics, dual Christie 4K laser projectors, and broadcast streaming deck.',
    facilities: [
      {
        name: 'Main Auditorium & Stage',
        type: 'Keynotes & Presentations',
        capacity: '450 Attendees',
        hours: '10:00 - 20:00',
        fee: '$50 / event',
        amenities: ['Concert Audio System', 'Dual 4K Laser Projection', 'Wireless Shure Mics', 'Stage Spotlights'],
      },
    ],
    coordinates: 'Grid A-3 • West Plaza',
    accessProtocol: 'Faculty or Student Union sponsorship required for bookings',
  },
  {
    id: 'zone-e',
    code: 'ZONE-E',
    name: 'Transit Bay & Logistics Depot',
    building: 'East Campus Perimeter Depot',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1000&q=80',
    description:
      'Central terminal for eco-friendly campus express shuttles and media gear checkouts (DSLR cameras, boom mics, drone kits).',
    facilities: [
      {
        name: 'Express Campus Shuttle (North-South)',
        type: 'Transportation',
        capacity: '24 Passengers',
        hours: '07:30 - 21:30',
        fee: 'Free',
        amenities: ['Electric Powertrain', 'Live GPS Tracking', 'Wheelchair Ramp', 'Air Conditioned'],
      },
      {
        name: 'Media & AV Equipment Depot',
        type: 'Rental Gear',
        capacity: 'Single Borrower',
        hours: '09:00 - 18:00',
        fee: '$15 / day',
        amenities: ['Sony Cinema Rig', 'DJI Gimbal', 'Wireless Lav Mic Kit', 'Protective Case'],
      },
    ],
    coordinates: 'Grid E-1 • Perimeter Loop',
    accessProtocol: 'Valid Campus ID deposit required at equipment desk',
  },
];

export default function CampusMapPage() {
  const [selectedZone, setSelectedZone] = useState(campusZones[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block mb-1">
          Spatial & Architectural Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Campus Architectural Zones & Facility Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
          Locate academic wings, compute clusters, sports arenas, and transit terminals across the university grounds.
        </p>
      </div>

      {/* Main Grid: Zone Selector & Zone Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Zone List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500">
              Campus Zones ({campusZones.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Live NFC Turnstiles Active
            </span>
          </div>

          {campusZones.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZone(zone)}
                className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#143828] text-white border-[#143828] shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-emerald-300 text-[#0f241a]'
                          : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {zone.code}
                    </span>
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {zone.name}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {zone.building}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition ${
                    isSelected ? 'text-emerald-300 translate-x-0.5' : 'text-stone-400'
                  }`}
                />
              </button>
            );
          })}

          <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1.5 mt-3">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-[#143828]" />
              <span>Turnstile Clearance Guide</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Present your QR token or tap your student NFC card at the entry gate. Reservations automatically clear 10 minutes prior to the booked slot.
            </p>
          </div>
        </div>

        {/* Right Active Zone Blueprint Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs space-y-6">
            {/* Zone Photography Header */}
            <div className="relative aspect-[16/9] sm:h-64 bg-stone-900 overflow-hidden">
              <img
                src={selectedZone.image}
                alt={selectedZone.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400 text-stone-950">
                  {selectedZone.code}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-900/80 text-white backdrop-blur-xs">
                  {selectedZone.coordinates}
                </span>
              </div>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <h2 className="text-xl sm:text-2xl font-extrabold">{selectedZone.name}</h2>
                <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedZone.building}</span>
                </p>
              </div>
            </div>

            {/* Zone Details */}
            <div className="p-6 pt-0 space-y-5">
              <p className="text-xs text-stone-700 leading-relaxed">
                {selectedZone.description}
              </p>

              {/* Access Protocol Banner */}
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-[#143828] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-900 block text-[11px] uppercase font-mono tracking-wider">
                    Entry Protocol
                  </strong>
                  <span className="text-stone-600 text-[11px]">
                    {selectedZone.accessProtocol}
                  </span>
                </div>
              </div>

              {/* Facilities Inside This Zone */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#143828]" />
                  <span>Facilities In This Zone</span>
                </h3>

                <div className="space-y-2.5">
                  {selectedZone.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-stone-200 hover:border-stone-400 transition shadow-2xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{fac.name}</h4>
                          <span className="text-[11px] text-stone-500 font-mono">{fac.type}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          {fac.fee}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 font-mono">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          <span>{fac.capacity}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{fac.hours}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {fac.amenities.map((am, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                          >
                            {am}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                        <Link
                          to="/"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143828] hover:bg-[#1B4D36] text-white text-xs font-bold transition shadow-2xs"
                        >
                          <span>Reserve in Catalog</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
