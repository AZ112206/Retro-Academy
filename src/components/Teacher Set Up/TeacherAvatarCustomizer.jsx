import React, { useState } from 'react';

// Retro aesthetic option palettes
const HAIR_STYLES = ['Classic Part', 'Messy Bun', 'Retro Mullet', 'Spiky Pixie', 'Bald & Proud', 'Vintage Waves'];
const HAIR_COLORS = ['#4a3728', '#2c3e50', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e'];
const OUTFITS = ['Tweed Jacket with Elbow Patches', 'Neon Grid Sweater', 'Button-Down & Tie', 'Vintage Cardigan', 'Casual Denim Blazer'];
const OUTFITS_COLORS = ['#27ae60', '#2980b9', '#8e44ad', '#d35400', '#2c3e50'];
const EXPRESSIONS = ['🍎 Enthusiastic', '🕶️ Ultra Cool', '☕ Sleep Deprived', '📚 Laser Focused', '🤔 Puzzled'];
const ACCESSORIES = ['None', 'Classic Spectacles', 'Coffee Thermos', 'Laser Pointer', 'Retro Wristwatch', 'Gold Chalk Holder'];

export default function TeacherAvatarCustomizer({ onSaveAvatar, onBack, styles }) {
  // Avatar state configuration
  const [hairStyle, setHairStyle] = useState(HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [outfit, setOutfit] = useState(OUTFITS[0]);
  const [outfitColor, setOutfitColor] = useState(OUTFITS_COLORS[0]);
  const [expression, setExpression] = useState(EXPRESSIONS[0]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [teacherName, setTeacherName] = useState('');

  const handleFinishCustomization = () => {
    if (!teacherName.trim()) {
      alert('⚠️ Security Notice: Please input your authorized Instructor Name before stepping onto campus!');
      return;
    }
    
    // Package avatar configuration package to send to main game engine
    onSaveAvatar({
      name: teacherName,
      hairStyle,
      hairColor,
      outfit,
      outfitColor,
      expression,
      accessory
    });
  };

  // Inline CSS for rendering a simplified retro vector representation of the avatar preview box
  const previewBoxStyle = {
    width: '200px',
    height: '200px',
    backgroundColor: '#111',
    border: '3px solid #39FF14',
    borderRadius: '8px',
    margin: '0 auto 20px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '900px' }}>
      <h2 style={styles.heading}>📇 ISSUE FACULTY IDENTIFICATION BADGE</h2>
      <p style={styles.subtitle}>Customize your 2D retro avatar and register your operational credentials:</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', marginTop: '20px', textAlign: 'left' }}>
        
        {/* LEFT COLUMN: LIVE RETRO BADGE PREVIEW */}
        <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #39FF14', textAlign: 'center' }}>
          <h3 style={{ color: '#39FF14', marginTop: 0, fontSize: '1rem' }}>📷 LIVE FEED DRAFT</h3>
          
          <div style={previewBoxStyle}>
            {/* Simple procedural preview assets using layout styling primitives */}
            {/* Hair Layer */}
            <div style={{ width: '80px', height: '40px', backgroundColor: hairColor, borderRadius: '20px 20px 0 0', position: 'absolute', top: '45px', zIndex: 2 }} />
            {/* Head Layer */}
            <div style={{ width: '70px', height: '70px', backgroundColor: '#ffd39b', borderRadius: '50%', position: 'absolute', top: '55px', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                {expression.split(' ')[0]} {/* Grabs the emoji from expression */}
              </span>
            </div>
            {/* Outfit Body Layer */}
            <div style={{ width: '110px', height: '70px', backgroundColor: outfitColor, borderRadius: '30px 30px 0 0', position: 'absolute', bottom: '0px', zIndex: 1 }} />
            {/* Accessory Tag */}
            {accessory !== 'None' && (
              <div style={{ position: 'absolute', bottom: '15px', right: '35px', zIndex: 3, fontSize: '1.5rem' }}>
                {accessory.includes('Spectacles') ? '👓' : accessory.includes('Thermos') ? '☕' : accessory.includes('Pointer') ? '🔦' : accessory.includes('Watch') ? '⌚' : '🖍️'}
              </div>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ color: '#39FF14', fontWeight: 'bold', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
              INSTRUCTOR SIGNATURE:
            </label>
            <input 
              type="text" 
              maxLength={20}
              placeholder="e.g., Mx. Smith"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#000',
                color: '#fff',
                border: '1px solid #39FF14',
                padding: '10px',
                borderRadius: '4px',
                fontFamily: 'inherit',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE INPUT MODIFIERS */}
        <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', border: '1px solid #39FF14', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '420px', overflowY: 'auto' }}>
          
          {/* Hair Style configuration */}
          <div>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold' }}>💇 HAIRSTYLE</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
              {HAIR_STYLES.map(style => (
                <button key={style} onClick={() => setHairStyle(style)} style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: hairStyle === style ? '#fff' : '#121212', color: hairStyle === style ? '#000' : '#fff', border: `1px solid ${hairStyle === style ? '#fff' : '#39FF14'}`, borderRadius: '4px', cursor: 'pointer' }}>
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color selection */}
          <div>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold' }}>🎨 HAIR COLOR</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
              {HAIR_COLORS.map(color => (
                <button key={color} onClick={() => setHairColor(color)} style={{ width: '24px', height: '24px', backgroundColor: color, border: hairColor === color ? '2px solid #fff' : '1px solid #000', borderRadius: '50%', cursor: 'pointer' }} />
              ))}
            </div>
          </div>

          {/* Outfit Type specification */}
          <div>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold' }}>👔 WARDROBE RAIMENT</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
              {OUTFITS.map(style => (
                <button key={style} onClick={() => setOutfit(style)} style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: outfit === style ? '#fff' : '#121212', color: outfit === style ? '#000' : '#fff', border: `1px solid ${outfit === style ? '#fff' : '#39FF14'}`, borderRadius: '4px', cursor: 'pointer' }}>
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Expressions config */}
          <div>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold' }}>🎭 FACIAL DISPOSITION</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
              {EXPRESSIONS.map(expr => (
                <button key={expr} onClick={() => setExpression(expr)} style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: expression === expr ? '#fff' : '#121212', color: expression === expr ? '#000' : '#fff', border: `1px solid ${expression === expr ? '#fff' : '#39FF14'}`, borderRadius: '4px', cursor: 'pointer' }}>
                  {expr}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment accessory config */}
          <div>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold' }}>💼 HELD ITEM ACCESSORY</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
              {ACCESSORIES.map(acc => (
                <button key={acc} onClick={() => setAccessory(acc)} style={{ padding: '6px 10px', fontSize: '0.75rem', backgroundColor: accessory === acc ? '#fff' : '#121212', color: accessory === acc ? '#000' : '#fff', border: `1px solid ${accessory === acc ? '#fff' : '#39FF14'}`, borderRadius: '4px', cursor: 'pointer' }}>
                  {acc}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER INTERACTION MATRIX */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', width: '100%' }}>
        <button style={{ ...styles.exitButton, flex: 1 }} onClick={onBack}>← RETURN TO CONTRACT</button>
        <button 
          style={{ ...styles.actionButton, flex: 2 }} 
          onClick={handleFinishCustomization}
        >
          📇 VALIDATE BADGE & START SCHOOL YEAR 🚀
        </button>
      </div>
    </div>
  );
}