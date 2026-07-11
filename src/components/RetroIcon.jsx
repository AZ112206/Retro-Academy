import React from 'react';

function pixel(color, left, top, width, height) {
  return {
    position: 'absolute',
    left,
    top,
    width,
    height,
    backgroundColor: color,
  };
}

function PixelCanvas({ children, size = 28 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        flex: '0 0 auto'
      }}
    >
      {children}
    </span>
  );
}

export function RetroArrow({ direction = 'right', color = '#39FF14', size = 18 }) {
  const isLeft = direction === 'left';

  return (
    <span
      aria-hidden="true"
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: `${size}px`, height: '10px', flex: '0 0 auto' }}
    >
      <span
        style={{
          position: 'absolute',
          top: '4px',
          left: isLeft ? '8px' : '0',
          width: '10px',
          height: '2px',
          backgroundColor: color,
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: isLeft ? '0' : '10px',
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderLeft: isLeft ? 'none' : `8px solid ${color}`,
          borderRight: isLeft ? `8px solid ${color}` : 'none',
        }}
      />
    </span>
  );
}

export function RetroClose({ color = '#FF3333', size = 14 }) {
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: `${size}px`, height: `${size}px`, flex: '0 0 auto' }}>
      <span style={{ position: 'absolute', top: '6px', left: '0', width: `${size}px`, height: '2px', backgroundColor: color, transform: 'rotate(45deg)' }} />
      <span style={{ position: 'absolute', top: '6px', left: '0', width: `${size}px`, height: '2px', backgroundColor: color, transform: 'rotate(-45deg)' }} />
    </span>
  );
}

export default function RetroIcon({ kind, size = 28 }) {
  const neon = '#39FF14';
  const dark = '#0A0A0A';
  const amber = '#F6D365';
  const cyan = '#44D9E6';
  const paper = '#E8E1D4';
  const red = '#FF5A5A';
  const cobalt = '#4D7CFE';
  const violet = '#8B5CF6';
  const coral = '#FF7B72';
  const mint = '#62F0B4';
  const gold = '#F2C14E';
  const terracotta = '#C96B4B';
  const rose = '#FF6FAE';
  const cream = '#F7F1E3';
  const sky = '#6CD4FF';
  const navy = '#1E2A78';

  const icons = {
    student: [
      <span key="body" style={pixel(neon, '7px', '9px', '14px', '14px')} />,
      <span key="flap" style={pixel(dark, '8px', '10px', '12px', '4px')} />,
      <span key="strapL" style={pixel(neon, '4px', '10px', '3px', '10px')} />,
      <span key="strapR" style={pixel(neon, '21px', '10px', '3px', '10px')} />,
      <span key="pocket" style={pixel(amber, '10px', '16px', '8px', '4px')} />,
    ],
    teacher: [
      <span key="apple" style={pixel(red, '7px', '8px', '14px', '14px')} />,
      <span key="leaf" style={pixel(neon, '16px', '4px', '6px', '4px')} />,
      <span key="stem" style={pixel(paper, '13px', '4px', '2px', '5px')} />,
    ],
    school: [
      <span key="roof" style={{ ...pixel(neon, '4px', '8px', '20px', '4px'), clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />,
      <span key="base" style={pixel(paper, '6px', '12px', '16px', '12px')} />,
      <span key="door" style={pixel(dark, '12px', '17px', '4px', '7px')} />,
      <span key="win1" style={pixel(cyan, '8px', '15px', '3px', '3px')} />,
      <span key="win2" style={pixel(cyan, '17px', '15px', '3px', '3px')} />,
    ],
    cap: [
      <span key="top" style={{ ...pixel(neon, '5px', '8px', '18px', '4px'), transform: 'skewX(-24deg)' }} />,
      <span key="base" style={pixel(paper, '10px', '13px', '10px', '4px')} />,
      <span key="tassel" style={pixel(amber, '20px', '12px', '2px', '8px')} />,
    ],
    pencil: [
      <span key="body" style={{ ...pixel(gold, '5px', '15px', '16px', '4px'), transform: 'rotate(-25deg)', transformOrigin: 'left center' }} />,
      <span key="stripe" style={{ ...pixel(coral, '10px', '14px', '4px', '4px'), transform: 'rotate(-25deg)', transformOrigin: 'left center' }} />,
      <span key="eraser" style={{ ...pixel(rose, '3px', '14px', '4px', '4px'), transform: 'rotate(-25deg)', transformOrigin: 'left center' }} />,
      <span key="tip" style={{ ...pixel(cream, '19px', '11px', '5px', '4px'), clipPath: 'polygon(0 0, 100% 50%, 0 100%)', transform: 'rotate(-25deg)', transformOrigin: 'left center' }} />,
    ],
    book: [
      <span key="left" style={pixel(coral, '5px', '7px', '8px', '16px')} />,
      <span key="right" style={pixel(cobalt, '15px', '7px', '8px', '16px')} />,
      <span key="spine" style={pixel(dark, '13px', '7px', '2px', '16px')} />,
      <span key="lineL" style={pixel(cream, '7px', '10px', '4px', '1px')} />,
      <span key="lineR" style={pixel(cream, '17px', '10px', '4px', '1px')} />,
    ],
    math: [
      <span key="frame" style={pixel(cobalt, '6px', '6px', '16px', '16px')} />,
      <span key="inner" style={pixel(cream, '8px', '8px', '12px', '12px')} />,
      <span key="line1" style={pixel(violet, '13px', '8px', '2px', '12px')} />,
      <span key="line2" style={pixel(violet, '8px', '13px', '12px', '2px')} />,
      <span key="dot1" style={pixel(gold, '10px', '10px', '2px', '2px')} />,
      <span key="dot2" style={pixel(gold, '16px', '16px', '2px', '2px')} />,
    ],
    science: [
      <span key="neck" style={pixel(cream, '12px', '5px', '4px', '6px')} />,
      <span key="flask" style={{ ...pixel(violet, '8px', '10px', '12px', '12px'), clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0 100%)' }} />,
      <span key="liquid" style={{ ...pixel(mint, '10px', '15px', '8px', '5px'), clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 100%)' }} />,
      <span key="bubble1" style={pixel(gold, '18px', '7px', '4px', '4px')} />,
      <span key="bubble2" style={pixel(cyan, '6px', '8px', '3px', '3px')} />,
    ],
    history: [
      <span key="roof" style={pixel(terracotta, '5px', '6px', '18px', '3px')} />,
      <span key="base" style={pixel(terracotta, '5px', '21px', '18px', '3px')} />,
      <span key="col1" style={pixel(cream, '7px', '9px', '3px', '12px')} />,
      <span key="col2" style={pixel(cream, '13px', '9px', '3px', '12px')} />,
      <span key="col3" style={pixel(cream, '19px', '9px', '3px', '12px')} />,
      <span key="seal" style={pixel(gold, '12px', '13px', '4px', '4px')} />,
    ],
    language: [
      <span key="bubble1" style={{ ...pixel(coral, '5px', '8px', '10px', '8px'), borderRadius: '4px' }} />,
      <span key="tail1" style={{ ...pixel(coral, '8px', '15px', '4px', '4px'), clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />,
      <span key="bubble2" style={{ ...pixel(cyan, '13px', '12px', '10px', '8px'), borderRadius: '4px' }} />,
      <span key="tail2" style={{ ...pixel(cyan, '17px', '19px', '4px', '4px'), clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />,
      <span key="mark1" style={pixel(cream, '8px', '11px', '4px', '1px')} />,
      <span key="mark2" style={pixel(cream, '16px', '15px', '4px', '1px')} />,
    ],
    globe: [
      <span key="circle" style={{ ...pixel(sky, '6px', '6px', '16px', '16px'), borderRadius: '50%' }} />,
      <span key="land1" style={{ ...pixel(mint, '8px', '10px', '6px', '4px'), borderRadius: '3px' }} />,
      <span key="land2" style={{ ...pixel(mint, '14px', '14px', '5px', '3px'), borderRadius: '3px' }} />,
      <span key="v" style={pixel(navy, '13px', '6px', '2px', '16px')} />,
      <span key="h" style={pixel(navy, '6px', '13px', '16px', '2px')} />,
    ],
    controller: [
      <span key="body" style={{ ...pixel(paper, '5px', '10px', '18px', '10px'), borderRadius: '5px' }} />,
      <span key="d1" style={pixel(dark, '9px', '13px', '6px', '2px')} />,
      <span key="d2" style={pixel(dark, '11px', '11px', '2px', '6px')} />,
      <span key="btn1" style={{ ...pixel(red, '18px', '12px', '3px', '3px'), borderRadius: '50%' }} />,
      <span key="btn2" style={{ ...pixel(cyan, '15px', '15px', '3px', '3px'), borderRadius: '50%' }} />,
    ],
    exit: [
      <span key="door" style={pixel(paper, '8px', '5px', '10px', '18px')} />,
      <span key="open" style={pixel(dark, '15px', '8px', '2px', '12px')} />,
      <span key="arrow" style={pixel(red, '19px', '13px', '5px', '2px')} />,
      <span key="tip" style={{ ...pixel(red, '22px', '11px', '4px', '6px'), clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />,
    ],
    contract: [
      <span key="paper" style={pixel(paper, '7px', '5px', '14px', '18px')} />,
      <span key="line1" style={pixel(neon, '10px', '10px', '8px', '2px')} />,
      <span key="line2" style={pixel(neon, '10px', '14px', '8px', '2px')} />,
      <span key="seal" style={{ ...pixel(red, '11px', '18px', '6px', '6px'), borderRadius: '50%' }} />,
    ],
    grid: [
      <span key="frame" style={pixel(paper, '5px', '5px', '18px', '18px')} />,
      <span key="v1" style={pixel(dark, '11px', '7px', '2px', '14px')} />,
      <span key="v2" style={pixel(dark, '17px', '7px', '2px', '14px')} />,
      <span key="h1" style={pixel(dark, '7px', '11px', '14px', '2px')} />,
      <span key="h2" style={pixel(dark, '7px', '17px', '14px', '2px')} />,
    ],
    tokens: [
      <span key="a" style={pixel(paper, '6px', '12px', '12px', '12px')} />,
      <span key="b" style={pixel(neon, '11px', '7px', '12px', '12px')} />,
      <span key="c" style={pixel(cyan, '14px', '4px', '8px', '8px')} />,
    ],
    shuffle: [
      <span key="line1" style={pixel(neon, '4px', '9px', '16px', '2px')} />,
      <span key="line2" style={pixel(neon, '8px', '17px', '16px', '2px')} />,
      <span key="tip1" style={{ ...pixel(neon, '18px', '7px', '6px', '6px'), clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />,
      <span key="tip2" style={{ ...pixel(neon, '4px', '15px', '6px', '6px'), clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />,
    ],
    lunch: [
      <span key="tray" style={pixel(amber, '5px', '16px', '18px', '5px')} />,
      <span key="cup" style={pixel(cyan, '6px', '10px', '4px', '6px')} />,
      <span key="plate" style={{ ...pixel(paper, '13px', '9px', '8px', '8px'), borderRadius: '50%' }} />,
    ],
    info: [
      <span key="circle" style={{ ...pixel(cyan, '7px', '5px', '14px', '18px'), borderRadius: '40%' }} />,
      <span key="stem" style={pixel(dark, '13px', '11px', '2px', '8px')} />,
      <span key="dot" style={pixel(dark, '13px', '8px', '2px', '2px')} />,
    ],
    class: [
      <span key="board" style={pixel(neon, '5px', '7px', '18px', '10px')} />,
      <span key="stand" style={pixel(paper, '13px', '17px', '2px', '7px')} />,
      <span key="desk1" style={pixel(paper, '6px', '20px', '5px', '3px')} />,
      <span key="desk2" style={pixel(paper, '17px', '20px', '5px', '3px')} />,
    ],
  };

  return <PixelCanvas size={size}>{icons[kind] || icons.book}</PixelCanvas>;
}