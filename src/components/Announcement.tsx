import React, { useState } from 'react';

interface AnnouncementProps {
  children: React.ReactNode;
  cta?: React.ReactNode;
  href: string;
}

export const Announcement: React.FC<AnnouncementProps> = ({
  cta,
  href,
  children,
}) => {
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  return (
    <section
      style={{
        backgroundColor: 'RGBA(255, 255, 255, 0.08)',
        marginBlock: '16px',
        marginInline: '-16px',
        paddingInline: '16px',
        paddingBlock: '16px',
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'center',
      }}
    >
      <p
        style={{
          margin: '0!important',
          textAlign: 'left',
        }}
      >
        {children}
      </p>
      <a
        style={{
          justifyContent: 'center',
          backgroundColor: isHoveringLink ? '#1d56dd' : '#0b6dff',
          transition: 'background-color 0.2s ease-in-out',
          padding: '8px 16px',
          borderRadius: '8px',
          color: 'white',
          textDecoration: 'none',
          width: 'max-content',
        }}
        href={href}
        onMouseEnter={() => setIsHoveringLink(true)}
        onMouseLeave={() => setIsHoveringLink(false)}
      >
        {cta}
      </a>
    </section>
  );
};
