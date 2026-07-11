import React, { useMemo, useState } from 'react';

const BODY_FRAMES = ['Masculine', 'Feminine'];
const SKIN_TONES = ['#F4D7C3', '#E7BB8C', '#D69C6B', '#B97850', '#8D5A3C', '#5F3B28'];
const HAIR_STYLES = ['Side Part', 'Crop', 'Waves', 'Bob', 'Mullet', 'Buzz'];
const HAIR_COLORS = ['#2B1B16', '#4A3728', '#6D4C41', '#8E6B3F', '#A63F3F', '#1F2E4F'];
const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart'];
const EYE_SHAPES = ['Focused', 'Round', 'Narrow', 'Soft'];
const EYE_COLORS = ['#201A17', '#4B3428', '#2A5B8A', '#3A7D44', '#7B5FA8', '#6B6F72'];
const BROW_STYLES = ['Straight', 'Arched', 'Soft', 'Bold'];
const NOSE_SHAPES = ['Short', 'Straight', 'Wide', 'Sharp'];
const MOUTH_STYLES = ['Calm', 'Smile', 'Smirk', 'Focused'];
const WARDROBE_COLORS = ['#1F3A5F', '#2D6A4F', '#7A3E2B', '#5B3F8C', '#6E4B2A', '#3C3C3C', '#9A2D2D', '#E8E1D4'];

function PixelArrow({ direction = 'right', color = '#39FF14' }) {
  const isLeft = direction === 'left';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', width: '18px', height: '10px', position: 'relative' }}>
      <span
        style={{
          width: '10px',
          height: '2px',
          backgroundColor: color,
          position: 'absolute',
          top: '4px',
          left: isLeft ? '8px' : '0'
        }}
      />
      <span
        style={{
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: isLeft ? 'none' : `8px solid ${color}`,
          borderRight: isLeft ? `8px solid ${color}` : 'none',
          position: 'absolute',
          left: isLeft ? '0' : '10px'
        }}
      />
    </span>
  );
}

function OptionButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 12px',
        fontSize: '0.75rem',
        backgroundColor: active ? '#f5f1dd' : '#121212',
        color: active ? '#111' : '#fff',
        border: `1px solid ${active ? '#f5f1dd' : '#39FF14'}`,
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}

function ColorButton({ active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '26px',
        height: '26px',
        backgroundColor: color,
        border: active ? '2px solid #fff' : '1px solid #000',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: active ? '0 0 0 2px rgba(57,255,20,0.3)' : 'none'
      }}
    />
  );
}

function getFaceGeometry(faceShape) {
  switch (faceShape) {
    case 'Round':
      return { width: '112px', height: '112px', radius: '50%' };
    case 'Square':
      return { width: '114px', height: '110px', radius: '10px' };
    case 'Heart':
      return { width: '108px', height: '116px', radius: '18px 18px 26px 26px' };
    default:
      return { width: '108px', height: '116px', radius: '18px' };
  }
}

function getHairGeometry(hairStyle, bodyFrame) {
  const topBase = bodyFrame === 'Feminine' ? '38px' : '46px';

  switch (hairStyle) {
    case 'Crop':
      return { width: '96px', height: '28px', top: '56px', radius: '8px' };
    case 'Waves':
      return { width: '108px', height: '52px', top: topBase, radius: '24px 24px 12px 12px' };
    case 'Bob':
      return { width: '118px', height: '62px', top: '42px', radius: '16px 16px 24px 24px' };
    case 'Mullet':
      return { width: '108px', height: '54px', top: '44px', radius: '18px 18px 12px 12px', clipPath: 'polygon(0 0, 100% 0, 100% 65%, 86% 65%, 86% 100%, 14% 100%, 14% 65%, 0 65%)' };
    case 'Buzz':
      return { width: '88px', height: '14px', top: '72px', radius: '8px' };
    default:
      return { width: '104px', height: '40px', top: '48px', radius: '20px 20px 10px 10px' };
  }
}

function getEyeGeometry(eyeShape) {
  switch (eyeShape) {
    case 'Round':
      return { width: '20px', height: '14px', radius: '50%', tilt: '0deg' };
    case 'Narrow':
      return { width: '24px', height: '8px', radius: '8px', tilt: '-6deg' };
    case 'Soft':
      return { width: '22px', height: '10px', radius: '10px', tilt: '4deg' };
    default:
      return { width: '22px', height: '9px', radius: '8px', tilt: '-2deg' };
  }
}

function getBrowGeometry(browStyle) {
  switch (browStyle) {
    case 'Arched':
      return { tiltLeft: '-16deg', tiltRight: '16deg', width: '24px' };
    case 'Soft':
      return { tiltLeft: '-4deg', tiltRight: '4deg', width: '22px' };
    case 'Bold':
      return { tiltLeft: '-8deg', tiltRight: '8deg', width: '28px', height: '5px' };
    default:
      return { tiltLeft: '-8deg', tiltRight: '8deg', width: '24px' };
  }
}

function getNoseGeometry(noseShape) {
  switch (noseShape) {
    case 'Straight':
      return { width: '10px', height: '26px', radius: '4px' };
    case 'Wide':
      return { width: '16px', height: '20px', radius: '8px' };
    case 'Sharp':
      return { width: '8px', height: '24px', radius: '2px' };
    default:
      return { width: '12px', height: '18px', radius: '6px' };
  }
}

function getMouthGeometry(mouthStyle) {
  switch (mouthStyle) {
    case 'Smile':
      return { width: '28px', height: '4px', radius: '0 0 10px 10px' };
    case 'Smirk':
      return { width: '24px', height: '3px', radius: '0 0 10px 0', offset: '8px' };
    case 'Focused':
      return { width: '18px', height: '2px', radius: '3px' };
    default:
      return { width: '20px', height: '2px', radius: '4px' };
  }
}

function getFrameGeometry(bodyFrame) {
  if (bodyFrame === 'Feminine') {
    return {
      torsoWidth: '136px',
      torsoHeight: '90px',
      torsoRadius: '26px 26px 10px 10px',
      shoulderWidth: '154px',
      hipWidth: '142px'
    };
  }

  return {
    torsoWidth: '148px',
    torsoHeight: '88px',
    torsoRadius: '18px 18px 8px 8px',
    shoulderWidth: '164px',
    hipWidth: '146px'
  };
}

export default function TeacherAvatarCustomizer({ onSaveAvatar, onBack, onExit, styles }) {
  const [bodyFrame, setBodyFrame] = useState(BODY_FRAMES[0]);
  const [skinTone, setSkinTone] = useState(SKIN_TONES[1]);
  const [hairStyle, setHairStyle] = useState(HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [faceShape, setFaceShape] = useState(FACE_SHAPES[0]);
  const [eyeShape, setEyeShape] = useState(EYE_SHAPES[0]);
  const [eyeColor, setEyeColor] = useState(EYE_COLORS[0]);
  const [browStyle, setBrowStyle] = useState(BROW_STYLES[0]);
  const [noseShape, setNoseShape] = useState(NOSE_SHAPES[0]);
  const [mouthStyle, setMouthStyle] = useState(MOUTH_STYLES[0]);
  const [topColor, setTopColor] = useState(WARDROBE_COLORS[0]);
  const [bottomColor, setBottomColor] = useState(WARDROBE_COLORS[5]);
  const [shoeColor, setShoeColor] = useState('#111111');
  const [teacherName, setTeacherName] = useState('');
  const [workingTextbook, setWorkingTextbook] = useState('');

  const faceGeometry = useMemo(() => getFaceGeometry(faceShape), [faceShape]);
  const hairGeometry = useMemo(() => getHairGeometry(hairStyle, bodyFrame), [hairStyle, bodyFrame]);
  const eyeGeometry = useMemo(() => getEyeGeometry(eyeShape), [eyeShape]);
  const browGeometry = useMemo(() => getBrowGeometry(browStyle), [browStyle]);
  const noseGeometry = useMemo(() => getNoseGeometry(noseShape), [noseShape]);
  const mouthGeometry = useMemo(() => getMouthGeometry(mouthStyle), [mouthStyle]);
  const frameGeometry = useMemo(() => getFrameGeometry(bodyFrame), [bodyFrame]);

  const previewBoxStyle = {
    width: '260px',
    height: '280px',
    backgroundColor: '#111',
    border: '3px solid #39FF14',
    borderRadius: '8px',
    margin: '0 auto 20px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'repeating-linear-gradient(180deg, rgba(57,255,20,0.08) 0, rgba(57,255,20,0.08) 2px, transparent 2px, transparent 6px)'
  };

  const panelStyle = {
    backgroundColor: '#1a1a1a',
    padding: '22px',
    borderRadius: '10px',
    border: '1px solid #39FF14',
    boxShadow: 'inset 0 0 0 1px rgba(57,255,20,0.12)'
  };

  const sectionStyle = {
    width: '100%',
    maxWidth: '440px',
    padding: '14px',
    borderRadius: '8px',
    backgroundColor: '#161616',
    border: '1px solid rgba(57,255,20,0.22)'
  };

  const controlRowStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
    justifyContent: 'center'
  };

  const handleFinishCustomization = () => {
    if (!teacherName.trim()) {
      alert('Security Notice: Please enter your instructor name before stepping onto campus.');
      return;
    }

    onSaveAvatar({
      name: teacherName,
      workingTextbook,
      bodyFrame,
      skinTone,
      hairStyle,
      hairColor,
      faceShape,
      eyeShape,
      eyeColor,
      browStyle,
      noseShape,
      mouthStyle,
      topColor,
      bottomColor,
      shoeColor
    });
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '980px' }}>
      <h2 style={styles.heading}>ISSUE FACULTY IDENTIFICATION BADGE</h2>
      <p style={styles.subtitle}>Adjust body frame, face details, colors, and wardrobe to build a retro faculty portrait.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '30px', marginTop: '20px', textAlign: 'center' }}>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <h3 style={{ color: '#39FF14', marginTop: 0, fontSize: '1rem', letterSpacing: '1px' }}>LIVE BADGE PREVIEW</h3>

          <div style={previewBoxStyle}>
            <div style={{ position: 'absolute', inset: '18px', border: '1px solid rgba(57,255,20,0.35)' }} />

            <div
              style={{
                position: 'absolute',
                top: hairGeometry.top,
                width: hairGeometry.width,
                height: hairGeometry.height,
                backgroundColor: hairColor,
                borderRadius: hairGeometry.radius,
                clipPath: hairGeometry.clipPath || 'none',
                zIndex: 4
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '76px',
                width: faceGeometry.width,
                height: faceGeometry.height,
                backgroundColor: skinTone,
                border: '3px solid #0a0a0a',
                borderRadius: faceGeometry.radius,
                zIndex: 3
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '22px',
                  left: '18px',
                  width: browGeometry.width,
                  height: browGeometry.height || '4px',
                  backgroundColor: hairColor,
                  transform: `rotate(${browGeometry.tiltLeft})`
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '22px',
                  right: '18px',
                  width: browGeometry.width,
                  height: browGeometry.height || '4px',
                  backgroundColor: hairColor,
                  transform: `rotate(${browGeometry.tiltRight})`
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '38px',
                  left: '24px',
                  width: eyeGeometry.width,
                  height: eyeGeometry.height,
                  backgroundColor: '#fff',
                  border: '2px solid #0a0a0a',
                  borderRadius: eyeGeometry.radius,
                  transform: `rotate(${eyeGeometry.tilt})`
                }}
              >
                <div style={{ width: '8px', height: '8px', backgroundColor: eyeColor, borderRadius: '50%', margin: '1px auto 0' }} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '38px',
                  right: '24px',
                  width: eyeGeometry.width,
                  height: eyeGeometry.height,
                  backgroundColor: '#fff',
                  border: '2px solid #0a0a0a',
                  borderRadius: eyeGeometry.radius,
                  transform: `rotate(${-parseInt(eyeGeometry.tilt, 10) || 0}deg)`
                }}
              >
                <div style={{ width: '8px', height: '8px', backgroundColor: eyeColor, borderRadius: '50%', margin: '1px auto 0' }} />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '58px',
                  left: 'calc(50% - 6px)',
                  width: noseGeometry.width,
                  height: noseGeometry.height,
                  backgroundColor: 'rgba(130, 77, 46, 0.35)',
                  borderRadius: noseGeometry.radius
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '88px',
                  left: `calc(50% - ${mouthGeometry.width} / 2)`,
                  width: mouthGeometry.width,
                  height: mouthGeometry.height,
                  backgroundColor: '#4d201f',
                  borderRadius: mouthGeometry.radius,
                  transform: `translateX(${mouthGeometry.offset || '0'})`
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                top: '180px',
                width: '34px',
                height: '20px',
                backgroundColor: skinTone,
                border: '3px solid #0a0a0a',
                zIndex: 2
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '196px',
                width: frameGeometry.shoulderWidth,
                height: '18px',
                backgroundColor: topColor,
                border: '3px solid #0a0a0a',
                borderBottom: 'none',
                borderRadius: '20px 20px 0 0',
                zIndex: 1
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '206px',
                width: frameGeometry.torsoWidth,
                height: frameGeometry.torsoHeight,
                backgroundColor: topColor,
                border: '3px solid #0a0a0a',
                borderRadius: frameGeometry.torsoRadius,
                zIndex: 1
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '232px',
                width: '28px',
                height: '54px',
                backgroundColor: '#e8dfd4',
                clipPath: bodyFrame === 'Feminine' ? 'polygon(50% 0, 100% 100%, 0 100%)' : 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)',
                zIndex: 2
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '0',
                width: frameGeometry.hipWidth,
                height: '54px',
                backgroundColor: bottomColor,
                borderTop: '3px solid #0a0a0a',
                zIndex: 0
              }}
            />

            <div style={{ position: 'absolute', bottom: '0', left: '96px', width: '20px', height: '44px', borderRight: '3px solid #0a0a0a', backgroundColor: bottomColor }} />
            <div style={{ position: 'absolute', bottom: '0', right: '96px', width: '20px', height: '44px', borderLeft: '3px solid #0a0a0a', backgroundColor: bottomColor }} />
            <div style={{ position: 'absolute', bottom: '0', left: '84px', width: '42px', height: '10px', backgroundColor: shoeColor, borderTop: '3px solid #0a0a0a' }} />
            <div style={{ position: 'absolute', bottom: '0', right: '84px', width: '42px', height: '10px', backgroundColor: shoeColor, borderTop: '3px solid #0a0a0a' }} />
          </div>

          <div style={{ ...sectionStyle, marginTop: '15px' }}>
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
                textAlign: 'center'
              }}
            />
            <label style={{ color: '#39FF14', fontWeight: 'bold', display: 'block', margin: '14px 0 8px', fontSize: '0.9rem' }}>
              WORKING TEXTBOOK:
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Algebra I Foundations, Unit 3"
              value={workingTextbook}
              onChange={(e) => setWorkingTextbook(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#000',
                color: '#fff',
                border: '1px solid #39FF14',
                padding: '10px',
                borderRadius: '4px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '76px'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#9acb92', letterSpacing: '0.6px' }}>
              PROFILE: {bodyFrame.toUpperCase()} / {faceShape.toUpperCase()} / {hairStyle.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ ...panelStyle, display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '560px', overflowY: 'auto', alignItems: 'center' }}>
          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>BODY FRAME</span>
            <div style={controlRowStyle}>
              {BODY_FRAMES.map((option) => (
                <OptionButton key={option} active={bodyFrame === option} onClick={() => setBodyFrame(option)}>{option}</OptionButton>
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>SKIN TONE</span>
            <div style={controlRowStyle}>
              {SKIN_TONES.map((color) => (
                <ColorButton key={color} color={color} active={skinTone === color} onClick={() => setSkinTone(color)} />
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>HAIR</span>
            <div style={controlRowStyle}>
              {HAIR_STYLES.map((option) => (
                <OptionButton key={option} active={hairStyle === option} onClick={() => setHairStyle(option)}>{option}</OptionButton>
              ))}
            </div>
            <div style={controlRowStyle}>
              {HAIR_COLORS.map((color) => (
                <ColorButton key={color} color={color} active={hairColor === color} onClick={() => setHairColor(color)} />
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>FACE SHAPE</span>
            <div style={controlRowStyle}>
              {FACE_SHAPES.map((option) => (
                <OptionButton key={option} active={faceShape === option} onClick={() => setFaceShape(option)}>{option}</OptionButton>
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>EYES</span>
            <div style={controlRowStyle}>
              {EYE_SHAPES.map((option) => (
                <OptionButton key={option} active={eyeShape === option} onClick={() => setEyeShape(option)}>{option}</OptionButton>
              ))}
            </div>
            <div style={controlRowStyle}>
              {EYE_COLORS.map((color) => (
                <ColorButton key={color} color={color} active={eyeColor === color} onClick={() => setEyeColor(color)} />
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>BROWS / NOSE / MOUTH</span>
            <div style={controlRowStyle}>
              {BROW_STYLES.map((option) => (
                <OptionButton key={option} active={browStyle === option} onClick={() => setBrowStyle(option)}>{option} Brows</OptionButton>
              ))}
            </div>
            <div style={controlRowStyle}>
              {NOSE_SHAPES.map((option) => (
                <OptionButton key={option} active={noseShape === option} onClick={() => setNoseShape(option)}>{option} Nose</OptionButton>
              ))}
            </div>
            <div style={controlRowStyle}>
              {MOUTH_STYLES.map((option) => (
                <OptionButton key={option} active={mouthStyle === option} onClick={() => setMouthStyle(option)}>{option} Mouth</OptionButton>
              ))}
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>WARDROBE COLORS</span>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Top</div>
            <div style={controlRowStyle}>
              {WARDROBE_COLORS.map((color) => (
                <ColorButton key={`top-${color}`} color={color} active={topColor === color} onClick={() => setTopColor(color)} />
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Bottom</div>
            <div style={controlRowStyle}>
              {WARDROBE_COLORS.map((color) => (
                <ColorButton key={`bottom-${color}`} color={color} active={bottomColor === color} onClick={() => setBottomColor(color)} />
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Shoes</div>
            <div style={controlRowStyle}>
              {['#111111', '#3C3C3C', '#5B3F2A', '#E8E1D4'].map((color) => (
                <ColorButton key={`shoe-${color}`} color={color} active={shoeColor === color} onClick={() => setShoeColor(color)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footerActions}>
        <button
          style={{ ...styles.backButton, flex: '1 1 180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          onClick={onBack}
        >
          <PixelArrow direction="left" /> BACK
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>MAIN MENU</button>
        <button
          style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          onClick={handleFinishCustomization}
        >
          VALIDATE BADGE <PixelArrow direction="right" color="#0a0a0a" />
        </button>
      </div>
    </div>
  );
}