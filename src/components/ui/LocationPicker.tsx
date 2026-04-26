'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface LocationItem {
  id: string;
  name: string;
}

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

const API_BASE = '/api/wilayah';

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [regencies, setRegencies] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [villages, setVillages] = useState<LocationItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegency, setSelectedRegency] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');

  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    fetch(`${API_BASE}/provinces.json`)
      .then((res) => res.json())
      .then((data: LocationItem[]) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setRegencies([]);
      return;
    }
    setLoadingRegencies(true);
    fetch(`${API_BASE}/regencies/${selectedProvince}.json`)
      .then((res) => res.json())
      .then((data: LocationItem[]) => setRegencies(data))
      .catch(() => setRegencies([]))
      .finally(() => setLoadingRegencies(false));
  }, [selectedProvince]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!selectedRegency) {
      setDistricts([]);
      return;
    }
    setLoadingDistricts(true);
    fetch(`${API_BASE}/districts/${selectedRegency}.json`)
      .then((res) => res.json())
      .then((data: LocationItem[]) => setDistricts(data))
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [selectedRegency]);

  // Fetch villages when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setVillages([]);
      return;
    }
    setLoadingVillages(true);
    fetch(`${API_BASE}/villages/${selectedDistrict}.json`)
      .then((res) => res.json())
      .then((data: LocationItem[]) => setVillages(data))
      .catch(() => setVillages([]))
      .finally(() => setLoadingVillages(false));
  }, [selectedDistrict]);

  // Build location string whenever selection changes
  const buildLocation = useCallback(() => {
    const parts: string[] = [];
    if (selectedVillage) {
      const village = villages.find((v) => v.id === selectedVillage);
      if (village) parts.push(titleCase(village.name));
    }
    if (selectedDistrict) {
      const district = districts.find((d) => d.id === selectedDistrict);
      if (district) parts.push(titleCase(district.name));
    }
    if (selectedRegency) {
      const regency = regencies.find((r) => r.id === selectedRegency);
      if (regency) parts.push(titleCase(regency.name));
    }
    if (selectedProvince) {
      const province = provinces.find((p) => p.id === selectedProvince);
      if (province) parts.push(titleCase(province.name));
    }
    return parts.join(', ');
  }, [selectedVillage, selectedDistrict, selectedRegency, selectedProvince, villages, districts, regencies, provinces]);

  // Update parent whenever the full location changes
  useEffect(() => {
    const loc = buildLocation();
    if (loc && loc !== value) {
      onChange(loc);
    }
  }, [buildLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectClass =
    'w-full px-4 py-3 rounded-2xl border border-neutral-border bg-neutral-card text-text-primary text-sm appearance-none cursor-pointer transition-all duration-200';

  return (
    <div className="flex flex-col gap-3">
      {/* Province */}
      <select
        value={selectedProvince}
        onChange={(e) => {
          setSelectedProvince(e.target.value);
          setSelectedRegency('');
          setSelectedDistrict('');
          setSelectedVillage('');
          setRegencies([]);
          setDistricts([]);
          setVillages([]);
        }}
        className={selectClass}
      >
        <option value="">Pilih Provinsi</option>
        {provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {titleCase(p.name)}
          </option>
        ))}
      </select>

      {/* Regency */}
      {selectedProvince && (
        <select
          value={selectedRegency}
          onChange={(e) => {
            setSelectedRegency(e.target.value);
            setSelectedDistrict('');
            setSelectedVillage('');
            setDistricts([]);
            setVillages([]);
          }}
          className={selectClass}
          disabled={loadingRegencies}
        >
          <option value="">
            {loadingRegencies ? 'Memuat...' : 'Pilih Kota/Kabupaten'}
          </option>
          {regencies.map((r) => (
            <option key={r.id} value={r.id}>
              {titleCase(r.name)}
            </option>
          ))}
        </select>
      )}

      {/* District */}
      {selectedRegency && (
        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedVillage('');
            setVillages([]);
          }}
          className={selectClass}
          disabled={loadingDistricts}
        >
          <option value="">
            {loadingDistricts ? 'Memuat...' : 'Pilih Kecamatan'}
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {titleCase(d.name)}
            </option>
          ))}
        </select>
      )}

      {/* Village */}
      {selectedDistrict && (
        <select
          value={selectedVillage}
          onChange={(e) => {
            setSelectedVillage(e.target.value);
          }}
          className={selectClass}
          disabled={loadingVillages}
        >
          <option value="">
            {loadingVillages ? 'Memuat...' : 'Pilih Kelurahan/Desa'}
          </option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {titleCase(v.name)}
            </option>
          ))}
        </select>
      )}

      {/* Show current selection */}
      {value && (
        <p className="text-xs text-text-secondary mt-1 px-1">
          📍 {value}
        </p>
      )}
    </div>
  );
}
