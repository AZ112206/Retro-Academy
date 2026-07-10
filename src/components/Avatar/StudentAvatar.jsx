const hairColorMap = {
  'Neon Pink': '#ff4da6',
  'Jet Black': '#202020',
  'Bleach Blonde': '#f6e58d',
  Auburn: '#a14a2a',
  'Emerald Green': '#1fa26e',
  'Chestnut Brown': '#7a4e2d',
  'Silver-Grey': '#bcc3cb'
};

const clothingColorMap = {
  'Oversized Vintage Hoodie': '#5b6c8f',
  'Thrifted Corduroy Jacket': '#8a6a4a',
  'Preppy Blazer & Tie': '#1f3b63',
  'Graphic Band Tee': '#30333a',
  'Denim Vest with Patches': '#436a8f',
  'Plain Turtleneck Sweater': '#4f5d73'
};

const expressionMap = {
  'Slightly Bored': '😑',
  'Laser Focused': '😤',
  'Daydreaming Out the Window': '🤔',
  'Smug Smirk': '😏',
  'Nervous Sweat-Drop': '😅',
  Yawning: '🥱'
};

const accessoryMap = {
  'Thick Rimmed Glasses': '👓',
  'Wireless Headphones Hanging on Neck': '🎧',
  'Beanie Pulled Low': '🧢',
  'Dangle Earrings': '💎',
  'Stack of Friendship Bracelets': '📿',
  None: ''
};

const hairStyleMap = {
  'Messy Bedhead': 'Messy',
  'Neat Side-Part': 'Side Part',
  Buzzcut: 'Buzzcut',
  'Long Waves': 'Long Waves',
  'High Ponytail': 'Ponytail',
  'Curly Afro': 'Curly Afro',
  'Spiky Retro Gel': 'Spiky',
  'Curtain Bangs': 'Curtain Bangs'
};

export default function StudentAvatar({ appearance = {} }) {
  const hairColor = hairColorMap[appearance.hairColor] || '#555';
  const clothingColor = clothingColorMap[appearance.clothing] || '#3f3f3f';
  const expression = expressionMap[appearance.expression] || '🙂';
  const accessory = accessoryMap[appearance.accessory] || '';
  const hairStyle = hairStyleMap[appearance.hairStyle] || 'Classic';

  return (
    <div style={styles.avatarFrame} aria-label="Student avatar">
      <div style={{ ...styles.hair, color: hairColor }}>{hairStyle}</div>
      <div style={styles.face}>{expression}</div>
      <div style={{ ...styles.clothing, backgroundColor: clothingColor }}>
        <span style={styles.accessory}>{accessory}</span>
      </div>
    </div>
  );
}

const styles = {
  avatarFrame: {
    width: '86px',
    minWidth: '86px',
    border: '1px solid #39FF14',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#171717',
    textAlign: 'center'
  },
  hair: {
    fontSize: '0.62rem',
    padding: '6px 4px 2px 4px',
    fontWeight: 'bold',
    minHeight: '20px'
  },
  face: {
    fontSize: '1.6rem',
    lineHeight: 1,
    padding: '2px 0 6px 0'
  },
  clothing: {
    borderTop: '1px solid #2a2a2a',
    minHeight: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  accessory: {
    fontSize: '0.9rem'
  }
};
