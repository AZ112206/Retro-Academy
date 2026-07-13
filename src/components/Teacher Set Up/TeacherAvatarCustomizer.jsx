import React, { useEffect, useMemo, useState } from 'react';
import { RetroArrow } from '../RetroIcon';

const GENDERS = ['Male', 'Female'];
const RACES = ['Black', 'Latino', 'White', 'Asian', 'Middle Eastern', 'Multiracial'];

// Gender-specific first name pools
const MALE_FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Arthur', 'Casey', 'Marcus', 'Parker', 'David', 'Quinn'];
const FEMALE_FIRST_NAMES = ['Avery', 'Riley', 'Reese', 'Morgan', 'Elena', 'Casey', 'Chloe', 'Sarah', 'Maya', 'Quinn'];

const LAST_NAMES_BY_RACE = {
  Black: ['Johnson', 'Brown', 'Washington', 'Brooks', 'Carter', 'Jackson'],
  Latino: ['Garcia', 'Martinez', 'Rivera', 'Lopez', 'Ramirez', 'Santos'],
  White: ['Miller', 'Bennett', 'Harris', 'Walker', 'Foster', 'Baker'],
  Asian: ['Kim', 'Patel', 'Chen', 'Singh', 'Nguyen', 'Park'],
  'Middle Eastern': ['Haddad', 'Nasser', 'Rahman', 'Malik', 'Farah', 'Sayeed'],
  Multiracial: ['Reed', 'Ellis', 'Monroe', 'Bailey', 'Hayes', 'Perry']
};
const SKIN_TONES_BY_RACE = {
  Black: ['#8B5A3C', '#6F432B', '#55301F'],
  Latino: ['#D39A73', '#B97D57', '#9A6142'],
  White: ['#F3D9C7', '#EBC4AF', '#D9AA8D'],
  Asian: ['#F0D2B3', '#D9B089', '#C28F69'],
  'Middle Eastern': ['#D7AC7E', '#BE8C5E', '#9A6945'],
  Multiracial: ['#E3BF9D', '#C68F69', '#8C5D40']
};
const NOSE_COLORS_BY_RACE = {
  Black: ['#7B4A2E', '#6A3F27', '#59351F'],
  Latino: ['#B3764F', '#9E6544', '#84543A'],
  White: ['#D2A285', '#BF9175', '#A87E66'],
  Asian: ['#C89A78', '#B38767', '#9C7458'],
  'Middle Eastern': ['#B9875F', '#A57553', '#8F6248'],
  Multiracial: ['#BC8A66', '#A77758', '#8F644B']
};

const HAIR_STYLES_BY_GENDER = {
  Male: ['Side Part', 'Crop', 'Waves', 'Mullet', 'Buzz', 'Fade', 'Slick Back', 'Spiky'],
  Female: ['Long Straight', 'Curly Long', 'Ponytail', 'Pigtails', 'Bun', 'Braids']
};

const HAIR_COLORS = ['#20140F', '#4A3728', '#6D4C41', '#8E6B3F', '#A63F3F', '#1F2E4F', '#F7F7F7', '#7F8C8D', '#0A0A0A'];
const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart'];
const EYE_SHAPES = ['Focused', 'Round', 'Narrow', 'Soft'];
const EYE_COLOR_OPTIONS = [
  { name: 'Brown', value: '#201A17' },
  { name: 'Hazel', value: '#4B3428' },
  { name: 'Blue', value: '#2A5B8A' },
  { name: 'Green', value: '#3A7D44' },
  { name: 'Violet', value: '#7B5FA8' },
  { name: 'Gray', value: '#6B6F72' }
];
const BROW_STYLES = ['Straight', 'Arched', 'Soft', 'Bold'];
const NOSE_SHAPES = ['Short', 'Straight', 'Wide', 'Sharp'];
const MOUTH_STYLES = ['Calm', 'Smile', 'Smirk', 'Focused'];
const UNIVERSAL_LIP_COLORS = ['#542423', '#8B3A62', '#A54B74', '#B85C7D', '#C96B79', '#D8788A', '#E29AA3'];
const HAIR_TIE_COLORS = ['#39FF14', '#FF007F', '#00FFFF', '#FFFF00', '#F7F7F7', '#7F8C8D', '#0A0A0A'];
const WARDROBE_COLORS = ['#1F3A5F', '#2D6A4F', '#7A3E2B', '#5B3F8C', '#6E4B2A', '#3C3C3C', '#9A2D2D', '#E8E1D4', '#F7F7F7', '#7F8C8D', '#0A0A0A'];
const DIRECTIONS = ['Front', 'Right', 'Back', 'Left'];

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
    case 'Round': return { width: 56, height: 56, borderRadius: '16px' };
    case 'Square': return { width: 58, height: 54, borderRadius: '4px' };
    case 'Heart': return { width: 56, height: 58, borderRadius: '12px 12px 18px 18px' };
    default: return { width: 56, height: 58, borderRadius: '10px' };
  }
}

function getHairGeometry(hairStyle, gender) {
  const isFemale = gender === 'Female';
  switch (hairStyle) {
    case 'Crop': return { width: 54, height: 12, top: -6, borderRadius: '4px' };
    case 'Waves': return { width: 58, height: 16, top: isFemale ? -8 : -4, borderRadius: '10px 10px 2px 2px' };
    case 'Slick Back': return { width: 56, height: 14, top: -6, borderRadius: '6px 6px 1px 1px' };
    case 'Spiky': return { width: 56, height: 20, top: -10, borderRadius: '4px 4px 0 0', clipPath: 'polygon(0% 100%, 10% 30%, 25% 70%, 40% 20%, 55% 60%, 70% 25%, 85% 75%, 100% 100%)' };
    case 'Long Straight': return { width: 60, height: 18, top: -10, borderRadius: '8px 8px 2px 2px', tail: 'long_straight', fringe: true };
    case 'Curly Long': return { width: 60, height: 20, top: -10, borderRadius: '10px 10px 4px 4px', tail: 'curly_long', fringe: true };
    case 'Mullet': return { width: 58, height: 32, top: -6, borderRadius: '8px 8px 4px 4px', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 82% 100%, 82% 40%, 18% 40%, 18% 100%, 0 100%)' };
    case 'Buzz': return { width: 54, height: 6, top: -2, borderRadius: '4px 4px 0 0' };
    case 'Fade': return { width: 54, height: 10, top: -4, borderRadius: '6px 6px 0 0', sideFade: true };
    case 'Ponytail': return { width: 58, height: 16, top: -8, borderRadius: '10px 10px 2px 2px', tail: 'pony', fringe: true };
    case 'Pigtails': return { width: 58, height: 16, top: -8, borderRadius: '10px 10px 2px 2px', tail: 'pigtails', fringe: true };
    case 'Bun': return { width: 58, height: 16, top: -6, borderRadius: '10px 10px 4px 4px', tail: 'bun', fringe: true };
    case 'Braids': return { width: 58, height: 18, top: -6, borderRadius: '8px 8px 2px 2px', tail: 'braids', fringe: true };
    default: return { width: 56, height: 14, top: -4, borderRadius: '6px 6px 2px 2px' };
  }
}

function getEyeGeometry(eyeShape) {
  switch (eyeShape) {
    case 'Round': return { width: 11, height: 10, borderRadius: '4px' };
    case 'Narrow': return { width: 13, height: 5, borderRadius: '2px' };
    case 'Soft': return { width: 12, height: 7, borderRadius: '3px' };
    default: return { width: 12, height: 6, borderRadius: '2px' };
  }
}

function getBrowGeometry(browStyle) {
  switch (browStyle) {
    case 'Arched': return { width: 14, height: 3, leftRotate: '-18deg', rightRotate: '18deg' };
    case 'Soft': return { width: 12, height: 2, leftRotate: '-5deg', rightRotate: '5deg' };
    case 'Bold': return { width: 16, height: 4, leftRotate: '-10deg', rightRotate: '10deg' };
    default: return { width: 14, height: 3, leftRotate: '-10deg', rightRotate: '10deg' };
  }
}

function getNoseGeometry(noseShape) {
  switch (noseShape) {
    case 'Straight': return { width: 6, height: 13 };
    case 'Wide': return { width: 10, height: 10 };
    case 'Sharp': return { width: 4, height: 14 };
    default: return { width: 8, height: 9 };
  }
}

function getMouthGeometry(mouthStyle) {
  switch (mouthStyle) {
    case 'Smile': return { width: 16, height: 4, borderRadius: '0 0 6px 6px', offset: 0 };
    case 'Smirk': return { width: 14, height: 3, borderRadius: '0 0 6px 0', offset: 2 };
    case 'Focused': return { width: 11, height: 2, borderRadius: '2px', offset: 0 };
    default: return { width: 12, height: 2, borderRadius: '2px', offset: 0 };
  }
}

function getBodyGeometry(gender) {
  return { shoulders: 84, torsoWidth: 74, torsoHeight: 54, torsoRadius: '6px', hipWidth: 78, neckTop: 92, neckHeight: 24, neckWidth: 20, torsoTop: 114, hipOverlap: 8 };
}

function buildAppearance(state, overrides = {}) {
  return { ...state, ...overrides };
}

export function PixelAvatar({ appearance, size = 'large', direction = 'Front', motion = { blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 } }) {
  const face = getFaceGeometry(appearance.faceShape);
  const hair = getHairGeometry(appearance.hairStyle, appearance.gender);
  const eyes = getEyeGeometry(appearance.eyeShape);
  const brows = getBrowGeometry(appearance.browStyle);
  const nose = getNoseGeometry(appearance.noseShape);
  const mouth = getMouthGeometry(appearance.mouthStyle);
  const body = getBodyGeometry(appearance.gender);
  const isSmall = size === 'small';
  const scale = isSmall ? 0.58 : 1;
  const canvas = isSmall ? 108 : 280;
  
  const faceTop = isSmall ? 16 : 24;
  const centerX = canvas / 2;
  const neckTop = faceTop + 54 * scale;
  const torsoTop = neckTop + 18 * scale;
  const torsoBottom = torsoTop + body.torsoHeight * scale;
  const hipTop = torsoBottom - body.hipOverlap * scale;
  const legTop = hipTop + 24 * scale;
  const shoeTop = legTop + 34 * scale;
  const borderColor = '#0A0A0A';
  
  const facingFront = direction === 'Front';
  const facingBack = direction === 'Back';
  const facingLeft = direction === 'Left';
  const facingRight = direction === 'Right';
  const facingSide = facingLeft || facingRight;
  
  const sideFeatureOffset = facingLeft ? -10 : 10;
  
  const armBaseY = torsoTop + 4 * scale;
  const handY = armBaseY + 34 * scale + motion.armSwing * scale;
  
  const mouthHeight = motion.blink ? Math.max(1, mouth.height - 1) : mouth.height + Math.max(0, motion.mouthShift);
  const hairLeftInFace = ((face.width - hair.width) / 2) * scale;
  const fringeWidth = Math.min(44, hair.width - 6);
  const fringeLeftInFace = ((face.width - fringeWidth) / 2) * scale;

  const hX = isSmall ? 0 : motion.hairX * scale;
  const hY = isSmall ? 0 : motion.hairY * scale;

  return (
    <div
      style={{
        position: 'relative',
        width: `${canvas}px`,
        height: `${canvas}px`,
        margin: '0 auto',
        backgroundColor: '#111',
        border: isSmall ? '1px solid rgba(57,255,20,0.25)' : '3px solid #39FF14',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundImage: 'repeating-linear-gradient(180deg, rgba(57,255,20,0.08) 0, rgba(57,255,20,0.08) 2px, transparent 2px, transparent 6px)'
      }}
    >
      <div style={{ position: 'absolute', inset: isSmall ? '8px' : '18px', border: '1px solid rgba(57,255,20,0.28)' }} />

      <div style={{ position: 'absolute', inset: 0 }}>

      {(appearance.hairStyle === 'Braids' || appearance.hairStyle === 'Pigtails' || appearance.hairStyle === 'Long Straight' || appearance.hairStyle === 'Curly Long' || appearance.hairStyle === 'Ponytail') && (
        <div
          style={{
            position: 'absolute',
            left: `${centerX - ((hair.width + 4) * scale) / 2 + hX}px`,
            top: `${faceTop + 24 * scale + hair.top * scale + (facingBack ? -2 * scale : 0) + hY}px`,
            width: `${(hair.width + 4) * scale}px`,
            height: `${(hair.height + 24) * scale}px`,
            backgroundColor: appearance.hairColor,
            borderRadius: hair.borderRadius,
            zIndex: 1,
            transform: `rotate(${hX * 1.5}deg)`,
            transformOrigin: 'top center',
            backgroundImage: appearance.hairStyle === 'Curly Long' ? 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.18) 1px, transparent 1px)' : undefined,
            backgroundSize: appearance.hairStyle === 'Curly Long' ? '6px 6px' : undefined
          }}
        />
      )}

      {hair.tail === 'pony' && (
        <div 
          style={{ 
            position: 'absolute', 
            left: `${centerX - 10 * scale + hX}px`, 
            top: `${faceTop + (facingBack ? 24 : 28) * scale + hY}px`, 
            width: `${20 * scale}px`, 
            height: `${64 * scale}px`, 
            backgroundColor: appearance.hairColor, 
            borderRadius: '0 0 16px 16px', 
            zIndex: 1, 
            transform: `rotate(${hX * 1.5}deg)`, 
            transformOrigin: 'top center' 
          }} 
        />
      )}
      
      {hair.tail === 'pigtails' && (
        <>
          <div style={{ position: 'absolute', left: `${centerX - 29 * scale + hX}px`, top: `${faceTop + 34 * scale + hY}px`, width: `${14 * scale}px`, height: `${5 * scale}px`, backgroundColor: appearance.hairTieColor || '#39FF14', zIndex: 2 }} />
          <div style={{ position: 'absolute', left: `${centerX + 15 * scale + hX}px`, top: `${faceTop + 34 * scale + hY}px`, width: `${14 * scale}px`, height: `${5 * scale}px`, backgroundColor: appearance.hairTieColor || '#39FF14', zIndex: 2 }} />
          
          <div style={{ position: 'absolute', left: `${centerX - 31 * scale + hX}px`, top: `${faceTop + 38 * scale + hY}px`, width: `${18 * scale}px`, height: `${36 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: facingBack ? '10px 10px 12px 12px' : '8px 0 6px 12px', zIndex: 1, transform: `rotate(${hX * 1.8}deg)`, transformOrigin: 'top right' }} />
          <div style={{ position: 'absolute', left: `${centerX + 13 * scale + hX}px`, top: `${faceTop + 38 * scale + hY}px`, width: `${18 * scale}px`, height: `${36 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: facingBack ? '10px 10px 12px 12px' : '0 8px 12px 6px', zIndex: 1, transform: `rotate(${hX * 1.8}deg)`, transformOrigin: 'top left' }} />
        </>
      )}
      
      {hair.tail === 'bun' && (
        <>
          <div style={{ position: 'absolute', left: `${centerX - 16 * scale}px`, top: `${faceTop + (facingBack ? 14 : 18) * scale}px`, width: `${32 * scale}px`, height: `${6 * scale}px`, backgroundColor: appearance.hairTieColor || '#39FF14', borderRadius: '2px', zIndex: 2 }} />
          <div style={{ position: 'absolute', left: `${centerX - 14 * scale}px`, top: `${faceTop + (facingBack ? 0 : 4) * scale}px`, width: `${28 * scale}px`, height: `${18 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: '50% 50% 4px 4px', zIndex: 1 }} />
        </>
      )}
      
      {hair.tail === 'braids' && (
        <>
          <div style={{ position: 'absolute', left: `${centerX - 26 * scale + hX * 1.4}px`, top: `${faceTop + 42 * scale + hY}px`, width: `${10 * scale}px`, height: `${40 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: '4px', zIndex: 1, transform: `rotate(${hX * 2.5}deg)`, transformOrigin: 'top center', backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%)', backgroundSize: '4px 4px' }} />
          <div style={{ position: 'absolute', left: `${centerX + 16 * scale + hX * 1.4}px`, top: `${faceTop + 42 * scale + hY}px`, width: `${10 * scale}px`, height: `${40 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: '4px', zIndex: 1, transform: `rotate(${hX * 2.5}deg)`, transformOrigin: 'top center', backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.15) 25%, transparent 25%)', backgroundSize: '4px 4px' }} />
        </>
      )}
      
      {hair.tail === 'long_straight' && (
        <div style={{ position: 'absolute', left: `${centerX - 22 * scale + hX}px`, top: `${faceTop + 36 * scale + hY}px`, width: `${44 * scale}px`, height: `${56 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: '0 0 10px 10px', zIndex: 1, transform: `rotate(${hX * 1.2}deg)`, transformOrigin: 'top center' }} />
      )}
      
      {hair.tail === 'curly_long' && (
        <div style={{ position: 'absolute', left: `${centerX - 23 * scale + hX}px`, top: `${faceTop + 36 * scale + hY}px`, width: `${46 * scale}px`, height: `${58 * scale}px`, backgroundColor: appearance.hairColor, borderRadius: '0 0 12px 12px', zIndex: 1, transform: `rotate(${hX * 1.4}deg)`, transformOrigin: 'top center', backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
      )}

      {/* CORE FACE LAYER */}
      <div
        style={{
          position: 'absolute',
          left: `${centerX - (face.width * scale) / 2}px`,
          top: `${faceTop + 24 * scale}px`,
          width: `${face.width * scale}px`,
          height: `${face.height * scale}px`,
          backgroundColor: appearance.skinTone,
          border: `${Math.max(2, 3 * scale)}px solid ${borderColor}`,
          borderRadius: face.borderRadius,
          zIndex: 4,
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${hairLeftInFace}px`,
            top: `${hair.top * scale}px`,
            width: `${hair.width * scale}px`,
            height: `${hair.height * scale}px`,
            backgroundColor: appearance.hairColor,
            borderRadius: hair.borderRadius,
            clipPath: hair.clipPath || 'none',
            zIndex: 5
          }}
        />

        {hair.fringe && !facingBack && (
          <div
            style={{
              position: 'absolute',
              left: `${fringeLeftInFace}px`,
              top: `${(hair.top + 6) * scale}px`,
              width: `${fringeWidth * scale}px`,
              height: `${4 * scale}px`,
              backgroundColor: appearance.hairColor,
              borderRadius: '0 0 1px 1px',
              zIndex: 6
            }}
          />
        )}

        {!facingBack && (
          <>
            {facingFront && (
              <>
                <div style={{ position: 'absolute', top: `${(10 + motion.browShift) * scale}px`, left: `${11 * scale}px`, width: `${brows.width * scale}px`, height: `${brows.height * scale}px`, backgroundColor: appearance.hairColor, transform: `rotate(${brows.leftRotate})`, zIndex: 7 }} />
                <div style={{ position: 'absolute', top: `${(10 + motion.browShift) * scale}px`, right: `${11 * scale}px`, width: `${brows.width * scale}px`, height: `${brows.height * scale}px`, backgroundColor: appearance.hairColor, transform: `rotate(${brows.rightRotate})`, zIndex: 7 }} />
                
                <div style={{ position: 'absolute', top: `${18 * scale}px`, left: `${12 * scale}px`, width: `${eyes.width * scale}px`, height: `${(motion.blink ? 2 : eyes.height) * scale}px`, backgroundColor: '#F7F7F7', border: `${Math.max(1, 2 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 7 }}>
                  {!motion.blink && <div style={{ width: `${4 * scale}px`, height: `${4 * scale}px`, backgroundColor: appearance.eyeColor, margin: '1px auto 0' }} />}
                </div>
                <div style={{ position: 'absolute', top: `${18 * scale}px`, right: `${12 * scale}px`, width: `${eyes.width * scale}px`, height: `${(motion.blink ? 2 : eyes.height) * scale}px`, backgroundColor: '#F7F7F7', border: `${Math.max(1, 2 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 7 }}>
                  {!motion.blink && <div style={{ width: `${4 * scale}px`, height: `${4 * scale}px`, backgroundColor: appearance.eyeColor, margin: '1px auto 0' }} />}
                </div>
                
                <div style={{ position: 'absolute', top: `${26 * scale}px`, left: `calc(50% - ${(nose.width * scale) / 2}px)`, width: `${nose.width * scale}px`, height: `${nose.height * scale}px`, backgroundColor: appearance.noseColor || 'rgba(124,84,55,0.38)', zIndex: 7 }} />
                <div style={{ position: 'absolute', top: `${36 * scale}px`, left: `calc(50% - ${(mouth.width * scale) / 2 - mouth.offset * scale}px)`, width: `${mouth.width * scale}px`, height: `${mouthHeight * scale}px`, backgroundColor: appearance.lipColor || '#542423', borderRadius: mouth.borderRadius, zIndex: 7 }} />
              </>
            )}
            {facingSide && (
              <>
                <div style={{ position: 'absolute', top: `${(10 + motion.browShift) * scale}px`, left: `calc(50% - ${(brows.width * scale) / 2}px + ${sideFeatureOffset * scale}px)`, width: `${brows.width * scale}px`, height: `${brows.height * scale}px`, backgroundColor: appearance.hairColor, zIndex: 7 }} />
                
                <div style={{ position: 'absolute', top: `${18 * scale}px`, left: `calc(50% - ${(eyes.width * scale) / 2}px + ${sideFeatureOffset * scale}px)`, width: `${eyes.width * scale}px`, height: `${(motion.blink ? 2 : eyes.height) * scale}px`, backgroundColor: '#F7F7F7', border: `${Math.max(1, 2 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 7 }}>
                  {!motion.blink && <div style={{ width: `${4 * scale}px`, height: `${4 * scale}px`, backgroundColor: appearance.eyeColor, margin: '1px auto 0' }} />}
                </div>
                
                <div style={{ position: 'absolute', top: `${26 * scale}px`, left: `calc(50% - ${(nose.width * scale) / 2}px + ${(sideFeatureOffset + (facingLeft ? -4 : 4)) * scale}px)`, width: `${nose.width * scale}px`, height: `${nose.height * scale}px`, backgroundColor: appearance.noseColor || 'rgba(124,84,55,0.38)', zIndex: 7 }} />
                <div style={{ position: 'absolute', top: `${36 * scale}px`, left: `calc(50% - ${(mouth.width * scale) / 2}px + ${(sideFeatureOffset + (facingLeft ? -mouth.offset : mouth.offset)) * scale}px)`, width: `${mouth.width * scale}px`, height: `${mouthHeight * scale}px`, backgroundColor: appearance.lipColor || '#542423', borderRadius: mouth.borderRadius, zIndex: 7 }} />
              </>
            )}
          </>
        )}
      </div>

      <div style={{ position: 'absolute', left: `calc(50% - ${(body.neckWidth / 2) * scale}px)`, top: `${neckTop}px`, width: `${body.neckWidth * scale}px`, height: `${30 * scale}px`, backgroundColor: appearance.skinTone, borderLeft: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, borderRight: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 3 }} />
      
      <div style={{ position: 'absolute', left: `calc(50% - ${(body.shoulders * scale) / 2 + 6 * scale}px)`, top: `${armBaseY + motion.armSwing * scale}px`, width: `${12 * scale}px`, height: `${42 * scale}px`, backgroundColor: appearance.topColor, border: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, borderRadius: '4px', boxSizing: 'border-box', zIndex: 4 }} />
      <div style={{ position: 'absolute', left: `calc(50% + ${(body.shoulders * scale) / 2 - 6 * scale}px)`, top: `${armBaseY - motion.armSwing * scale}px`, width: `${12 * scale}px`, height: `${42 * scale}px`, backgroundColor: appearance.topColor, border: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, borderRadius: '4px', boxSizing: 'border-box', zIndex: 4 }} />
      
      <div style={{ position: 'absolute', left: `calc(50% - ${(body.shoulders * scale) / 2 + 4 * scale}px)`, top: `${handY + 8 * scale}px`, width: `${8 * scale}px`, height: `${8 * scale}px`, backgroundColor: appearance.skinTone, border: `${Math.max(1, 2 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 4 }} />
      <div style={{ position: 'absolute', left: `calc(50% + ${(body.shoulders * scale) / 2 - 4 * scale}px)`, top: `${armBaseY + 38 * scale - motion.armSwing * scale}px`, width: `${8 * scale}px`, height: `${8 * scale}px`, backgroundColor: appearance.skinTone, border: `${Math.max(1, 2 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 4 }} />
      
      <div style={{ position: 'absolute', left: `calc(50% - ${(body.shoulders * scale) / 2}px)`, top: `${torsoTop - 8 * scale}px`, width: `${body.shoulders * scale}px`, height: `${12 * scale}px`, backgroundColor: appearance.topColor, border: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, borderBottom: 'none', boxSizing: 'border-box', zIndex: 3 }} />
      <div style={{ position: 'absolute', left: `calc(50% - ${(body.torsoWidth * scale) / 2}px)`, top: `${torsoTop}px`, width: `${body.torsoWidth * scale}px`, height: `${body.torsoHeight * scale}px`, backgroundColor: appearance.topColor, border: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, borderRadius: body.torsoRadius, boxSizing: 'border-box', zIndex: 3 }} />
      <div style={{ position: 'absolute', left: `calc(50% - ${(body.hipWidth * scale) / 2}px)`, top: `${hipTop}px`, width: `${body.hipWidth * scale}px`, height: `${26 * scale}px`, backgroundColor: appearance.bottomColor, borderTop: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 2 }} />
      <div style={{ position: 'absolute', left: `calc(50% - ${26 * scale}px)`, top: `${legTop + motion.footShift * scale}px`, width: `${18 * scale}px`, height: `${36 * scale}px`, backgroundColor: appearance.bottomColor, borderRight: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 2 }} />
      <div style={{ position: 'absolute', left: `calc(50% + ${8 * scale}px)`, top: `${legTop - motion.footShift * scale}px`, width: `${18 * scale}px`, height: `${36 * scale}px`, backgroundColor: appearance.bottomColor, borderLeft: `${Math.max(2, 3 * scale)}px solid ${borderColor}`, boxSizing: 'border-box', zIndex: 2 }} />
      <div style={{ position: 'absolute', left: `calc(50% - ${28 * scale}px)`, top: `${shoeTop + motion.footShift * scale}px`, width: `${22 * scale}px`, height: `${8 * scale}px`, backgroundColor: appearance.shoeColor, zIndex: 2 }} />
      <div style={{ position: 'absolute', left: `calc(50% + ${6 * scale}px)`, top: `${shoeTop - motion.footShift * scale}px`, width: `${22 * scale}px`, height: `${8 * scale}px`, backgroundColor: appearance.shoeColor, zIndex: 2 }} />
      </div>
    </div>
  );
}

function PreviewTile({ active, label, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '108px',
        padding: '8px',
        backgroundColor: active ? '#f5f1dd' : '#121212',
        color: active ? '#111' : '#fff',
        border: `1px solid ${active ? '#f5f1dd' : '#39FF14'}`,
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {children}
      <span style={{ fontSize: '0.65rem' }}>{label}</span>
    </button>
  );
}

function PreviewSelector({ label, options, activeValue, onSelect, buildOverride, appearance }) {
  return (
    <div style={{ width: '100%' }}>
      <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>{label}</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(108px, 108px))', gap: '8px', marginTop: '10px', justifyContent: 'center', justifyItems: 'center' }}>
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const tileLabel = typeof option === 'string' ? option : option.label;
          const mergedOverride = buildOverride(value);
          return (
            <PreviewTile key={value} active={activeValue === value} label={tileLabel} onClick={() => onSelect(value)}>
              <PixelAvatar appearance={buildAppearance(appearance, { ...mergedOverride, direction: 'Front' })} size="small" direction="Front" />
            </PreviewTile>
          );
        })}
      </div>
    </div>
  );
}

function buildDefaultBirthdayFromAge(ageValue) {
  const parsedAge = Number(ageValue);
  const safeAge = Number.isFinite(parsedAge) && parsedAge >= 18 ? parsedAge : 30;
  const birthYear = new Date().getFullYear() - safeAge;
  return `${birthYear}-01-01`;
}

export default function TeacherAvatarCustomizer({ onSaveAvatar, onBack, onExit, onSaveGame, styles }) {
  const [gender, setGender] = useState('Male');
  const [race, setRace] = useState('Black');
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState(MALE_FIRST_NAMES[0]);
  const [lastName, setLastName] = useState(LAST_NAMES_BY_RACE.Black[0]);
  const [skinTone, setSkinTone] = useState(SKIN_TONES_BY_RACE.Black[0]);
  const [hairStyle, setHairStyle] = useState(HAIR_STYLES_BY_GENDER.Male[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [hairTieColor, setHairTieColor] = useState(HAIR_TIE_COLORS[0]);
  const [faceShape, setFaceShape] = useState(FACE_SHAPES[0]);
  const [eyeShape, setEyeShape] = useState(EYE_SHAPES[0]);
  const [eyeColor, setEyeColor] = useState(EYE_COLOR_OPTIONS[0].value);
  const [browStyle, setBrowStyle] = useState(BROW_STYLES[0]);
  const [noseShape, setNoseShape] = useState(NOSE_SHAPES[0]);
  const [noseColor, setNoseColor] = useState(NOSE_COLORS_BY_RACE.Black[0]);
  const [mouthStyle, setMouthStyle] = useState(MOUTH_STYLES[0]);
  const [lipColor, setLipColor] = useState(UNIVERSAL_LIP_COLORS[0]);
  const [topColor, setTopColor] = useState(WARDROBE_COLORS[0]);
  const [bottomColor, setBottomColor] = useState(WARDROBE_COLORS[5]);
  const [shoeColor, setShoeColor] = useState('#111111');
  const [age, setAge] = useState('30');
  const [birthday, setBirthday] = useState(buildDefaultBirthdayFromAge('30'));
  const [workExperienceYears, setWorkExperienceYears] = useState('6');
  const [direction, setDirection] = useState('Front');
  
  const [motion, setMotion] = useState({ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 });

  const skinToneOptions = SKIN_TONES_BY_RACE[race];
  const noseColorOptions = NOSE_COLORS_BY_RACE[race];
  const lastNameOptions = LAST_NAMES_BY_RACE[race];
  const hairStyleOptions = HAIR_STYLES_BY_GENDER[gender];
  const badgeName = `${title} ${lastName}`;
  const rosterName = `${firstName} ${lastName}`;

  // FIXED: Flips first names pool parameters immediately when gender value shifts
  useEffect(() => {
    if (gender === 'Male') {
      setTitle('Mr.');
      setFirstName(MALE_FIRST_NAMES[Math.floor(Math.random() * MALE_FIRST_NAMES.length)]);
    } else {
      setTitle('Ms.');
      setFirstName(FEMALE_FIRST_NAMES[Math.floor(Math.random() * FEMALE_FIRST_NAMES.length)]);
    }
  }, [gender]);

  useEffect(() => {
    if (!hairStyleOptions.includes(hairStyle)) {
      setHairStyle(hairStyleOptions[0]);
    }
  }, [gender, hairStyle, hairStyleOptions]);

  useEffect(() => {
    if (!skinToneOptions.includes(skinTone)) {
      setSkinTone(skinToneOptions[0]);
    }
    // Only update default matching names if user hasn't typed a completely custom name manually
    if (lastNameOptions.includes(lastName) || lastName === '') {
      setLastName(lastNameOptions[0]);
    }
  }, [race, skinTone, skinToneOptions]);

  useEffect(() => {
    if (!noseColorOptions.includes(noseColor)) {
      setNoseColor(noseColorOptions[0]);
    }
  }, [race, noseColor, noseColorOptions]);

  useEffect(() => {
    let tick = 0;
    const idleInterval = setInterval(() => {
      tick += 0.2;
      const waveX = Math.sin(tick) * 2.5;
      const waveY = Math.abs(Math.cos(tick)) * 1.2;

      setMotion((current) => ({
        ...current,
        mouthShift: Math.random() > 0.6 ? 1 : 0,
        armSwing: Math.sin(tick) * 3,
        footShift: Math.cos(tick) * 1.5,
        browShift: Math.random() > 0.7 ? -1 : 0,
        hairX: waveX,
        hairY: waveY
      }));
    }, 100);

    const blinkInterval = setInterval(() => {
      setMotion((current) => ({ ...current, blink: true }));
      window.setTimeout(() => {
        setMotion((current) => ({ ...current, blink: false }));
      }, 180);
    }, 2600);

    return () => {
      clearInterval(idleInterval);
      clearInterval(blinkInterval);
    };
  }, []);

  useEffect(() => {
    const parsedAge = Number(age);
    const maxExperience = Number.isFinite(parsedAge) ? Math.max(0, parsedAge - 18) : 0;
    const parsedYears = Number(workExperienceYears);

    if (Number.isFinite(parsedYears) && parsedYears > maxExperience) {
      setWorkExperienceYears(String(maxExperience));
    }
  }, [age, workExperienceYears]);

  const appearance = useMemo(() => ({
    gender, skinTone, hairStyle, hairColor, hairTieColor, faceShape, eyeShape, eyeColor, browStyle, noseShape, noseColor, mouthStyle, lipColor, topColor, bottomColor, shoeColor
  }), [gender, skinTone, hairStyle, hairColor, hairTieColor, faceShape, eyeShape, eyeColor, browStyle, noseShape, noseColor, mouthStyle, lipColor, topColor, bottomColor, shoeColor]);

  const panelStyle = { backgroundColor: '#1a1a1a', padding: '22px', borderRadius: '10px', border: '1px solid #39FF14', boxShadow: 'inset 0 0 0 1px rgba(57,255,20,0.12)' };
  const sectionStyle = { width: '100%', maxWidth: '520px', padding: '14px', borderRadius: '8px', backgroundColor: '#161616', border: '1px solid rgba(57,255,20,0.22)' };
  const swatchRowStyle = { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', justifyContent: 'center', alignItems: 'center' };
  const profileInputStyle = { backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', width: '150px', fontSize: '0.85rem' };

  const handleFinishCustomization = () => {
    onSaveAvatar({ name: badgeName, badgeName, rosterName, firstName, lastName, title, gender, race, age, birthday, yearsTeaching: workExperienceYears, skinTone, hairStyle, hairColor, hairTieColor, faceShape, eyeShape, eyeColor, browStyle, noseShape, noseColor, mouthStyle, lipColor, topColor, bottomColor, shoeColor });
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '1080px' }}>
      <h2 style={styles.heading}>ISSUE FACULTY IDENTIFICATION BADGE</h2>
      <p style={styles.subtitle}>Build a pixel-styled teacher avatar, then lock in the faculty signature and appearance profile.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '30px', marginTop: '20px', textAlign: 'center' }}>
        <div style={{ ...panelStyle, textAlign: 'center' }}>
          <h3 style={{ color: '#39FF14', marginTop: 0, fontSize: '1rem', letterSpacing: '1px' }}>LIVE BADGE PREVIEW</h3>

          <PixelAvatar appearance={appearance} direction={direction} motion={motion} />

          <div style={{ ...sectionStyle, marginTop: '15px' }}>
            <div style={{ color: '#39FF14', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px', letterSpacing: '1px' }}>FLAT 360 VIEW</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))', gap: '8px', maxWidth: '260px', margin: '0 auto 10px' }}>
              {DIRECTIONS.map((option) => (
                <OptionButton key={option} active={direction === option} onClick={() => setDirection(option)}>{option}</OptionButton>
              ))}
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#fff' }}>CURRENT VIEW: {direction.toUpperCase()}</div>
            <div style={{ marginTop: '6px', fontSize: '0.72rem', color: '#9acb92' }}>Idle motion includes blinking eyes, mouth shifts, hand swings, and foot taps.</div>
          </div>

          <div style={{ ...sectionStyle, marginTop: '15px' }}>
            <div style={{ color: '#39FF14', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>INSTRUCTOR SIGNATURE</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', minWidth: '130px' }}>
                {GENDERS.map((option) => <option key={option}>{option}</option>)}
              </select>
              <select value={title} onChange={(e) => setTitle(e.target.value)} style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', minWidth: '110px' }}>
                {(gender === 'Male' ? ['Mr.', 'Dr.'] : ['Ms.', 'Mrs.', 'Dr.']).map((option) => <option key={option}>{option}</option>)}
              </select>
              <select value={race} onChange={(e) => setRace(e.target.value)} style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', minWidth: '160px' }}>
                {RACES.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>
            
            {/* FIXED: Form layout inputs allowing customized text entry overrides for first/last signatures */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#39FF14' }}>FIRST NAME</span>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="Enter First Name"
                  style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', width: '150px', fontSize: '0.85rem' }} 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#39FF14' }}>LAST NAME</span>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Enter Last Name"
                  style={{ backgroundColor: '#000', color: '#fff', border: '1px solid #39FF14', padding: '10px', borderRadius: '4px', width: '150px', fontSize: '0.85rem' }} 
                />
              </div>
            </div>
            
            <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#9acb92', letterSpacing: '0.5px' }}>
              BADGE NAME: {badgeName} | ROSTER NAME: {rosterName}
            </div>
          </div>
        </div>

        <div className="no-scrollbar" style={{ ...panelStyle, display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '680px', overflowY: 'auto', alignItems: 'stretch' }}>
          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>SKIN TONE</span>
            <div style={swatchRowStyle}>
              {skinToneOptions.map((color) => (
                <ColorButton key={color} color={color} active={skinTone === color} onClick={() => setSkinTone(color)} />
              ))}
            </div>
          </div>

          <PreviewSelector label="FACE SHAPE" options={FACE_SHAPES} activeValue={faceShape} onSelect={setFaceShape} appearance={appearance} buildOverride={(value) => ({ faceShape: value })} />
          <PreviewSelector label="EYE SHAPE" options={EYE_SHAPES} activeValue={eyeShape} onSelect={setEyeShape} appearance={appearance} buildOverride={(value) => ({ eyeShape: value })} />
          <PreviewSelector label="EYE COLOR" options={EYE_COLOR_OPTIONS.map((option) => ({ value: option.value, label: option.name }))} activeValue={eyeColor} onSelect={setEyeColor} appearance={appearance} buildOverride={(value) => ({ eyeColor: value })} />
          <PreviewSelector label="BROW STYLE" options={BROW_STYLES} activeValue={browStyle} onSelect={setBrowStyle} appearance={appearance} buildOverride={(value) => ({ browStyle: value })} />
          <PreviewSelector label="NOSE SHAPE" options={NOSE_SHAPES} activeValue={noseShape} onSelect={setNoseShape} appearance={appearance} buildOverride={(value) => ({ noseShape: value })} />

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>NOSE COLOR</span>
            <div style={swatchRowStyle}>
              {noseColorOptions.map((color) => (
                <ColorButton key={color} color={color} active={noseColor === color} onClick={() => setNoseColor(color)} />
              ))}
              <input type="color" value={noseColor} onChange={(e) => setNoseColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer', marginLeft: '6px' }} />
            </div>
          </div>
          <PreviewSelector label="MOUTH SHAPE" options={MOUTH_STYLES} activeValue={mouthStyle} onSelect={setMouthStyle} appearance={appearance} buildOverride={(value) => ({ mouthStyle: value })} />
          <PreviewSelector label="HAIR STYLE" options={hairStyleOptions} activeValue={hairStyle} onSelect={setHairStyle} appearance={appearance} buildOverride={(value) => ({ hairStyle: value, gender })} />

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>LIP CUSTOMIZATION</span>
            <div style={swatchRowStyle}>
              {UNIVERSAL_LIP_COLORS.map((color) => (
                <ColorButton key={color} color={color} active={lipColor === color} onClick={() => setLipColor(color)} />
              ))}
              <input type="color" value={lipColor} onChange={(e) => setLipColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer', marginLeft: '6px' }} />
            </div>
          </div>

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>HAIR COLOR</span>
            <div style={swatchRowStyle}>
              {HAIR_COLORS.map((color) => (
                <ColorButton key={color} color={color} active={hairColor === color} onClick={() => setHairColor(color)} />
              ))}
            </div>
          </div>

          {(hairStyle === 'Bun' || hairStyle === 'Pigtails') && (
            <div style={sectionStyle}>
              <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>HAIR TIE COLOR</span>
              <div style={swatchRowStyle}>
                {HAIR_TIE_COLORS.map((color) => (
                  <ColorButton key={color} color={color} active={hairTieColor === color} onClick={() => setHairTieColor(color)} />
                ))}
                <input type="color" value={hairTieColor} onChange={(e) => setHairTieColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer', marginLeft: '6px' }} />
              </div>
            </div>
          )}

          <div style={sectionStyle}>
            <span style={{ color: '#39FF14', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px' }}>WARDROBE COLORS</span>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Top</div>
            <div style={swatchRowStyle}>
              {WARDROBE_COLORS.map((color) => (
                <ColorButton key={`top-${color}`} color={color} active={topColor === color} onClick={() => setTopColor(color)} />
              ))}
              <input type="color" value={topColor} onChange={(e) => setTopColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer' }} />
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Bottom</div>
            <div style={swatchRowStyle}>
              {WARDROBE_COLORS.map((color) => (
                <ColorButton key={`bottom-${color}`} color={color} active={bottomColor === color} onClick={() => setBottomColor(color)} />
              ))}
              <input type="color" value={bottomColor} onChange={(e) => setBottomColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer' }} />
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#9acb92' }}>Shoes</div>
            <div style={swatchRowStyle}>
              {['#111111', '#3C3C3C', '#5B3F2A', '#E8E1D4', '#F7F7F7', '#7F8C8D'].map((color) => (
                <ColorButton key={`shoe-${color}`} color={color} active={shoeColor === color} onClick={() => setShoeColor(color)} />
              ))}
              <input type="color" value={shoeColor} onChange={(e) => setShoeColor(e.target.value)} style={{ width: '36px', height: '28px', background: 'transparent', border: '1px solid #39FF14', borderRadius: '4px', cursor: 'pointer' }} />
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#39FF14' }}>AGE</span>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={profileInputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#39FF14' }}>BIRTHDAY</span>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  style={profileInputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '0.65rem', color: '#39FF14' }}>WORK EXPERIENCE (YEARS)</span>
                <input
                  type="number"
                  min="0"
                  max={Math.max(0, Number(age || 0) - 18)}
                  value={workExperienceYears}
                  onChange={(e) => setWorkExperienceYears(e.target.value)}
                  style={profileInputStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={onBack}>
          <RetroArrow direction="left" /> BACK
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>MAIN MENU</button>
        <button style={{ ...styles.saveButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={onSaveGame}>SAVE GAME</button>
        <button style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleFinishCustomization}>
          VALIDATE BADGE <RetroArrow color="#0a0a0a" />
        </button>
      </div>
    </div>
  );
}