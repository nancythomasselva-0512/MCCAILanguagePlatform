import React from 'react';
import { ChevronDown } from 'lucide-react';
interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
  hideLabel?: boolean;
}

export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange, hideLabel = false }) => {
  const fontGroups = [
    {
      label: 'English Fonts',
      fonts: [
        'Arial',
        'Calibri',
        'Georgia',
        'Verdana',
        'Times New Roman',
        'Tahoma',
        'Trebuchet MS',
        'Courier New'
      ]
    },
    {
      label: 'Tamil Fonts',
      fonts: [
        'TAU-Marutham',
        'TAU-Kurinji',
        'TAU-Mullai',
        'TAU-Malar',
        'TAU-Neythal',
        'TAU-Paalai',
        'TAU-Nilavu',
        'Latha',
        'Nirmala UI'
      ]
    }
  ];

  const selectStyle = {
    background: 'var(--bg-subtle)',
    border: '1px solid var(--border-base)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="flex-1 min-w-0 sm:max-w-[150px]">
      {!hideLabel && (
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Font Family
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl px-3.5 pr-9 py-2.5 text-sm font-semibold focus:outline-none"
          style={selectStyle}
        >
          {fontGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.fonts.map((font) => (
                <option key={font} value={font}>
                  {font.replace('TAU-', '')}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
      </div>
    </div>
  );
};
