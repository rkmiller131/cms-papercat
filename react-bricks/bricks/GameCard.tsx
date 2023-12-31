import React, { useState, useEffect } from 'react';
import { types, Image, useAdminContext } from 'react-bricks/frontend';
import { UseGameClickedContext } from '../context/GameInfoContext';

import styles from '../../css/Games.module.css';

interface GameCardProps {
  name: string;
  summary: string;
  embeddedurl: string;
  steamLink: string;
}

const GameCard: types.Brick<GameCardProps> = ({ name, steamLink }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { changeGame } = UseGameClickedContext();
  const { isAdmin, previewMode } = useAdminContext();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={styles.gamesContent}
      onClick={() => {
        isMobile ? window.open(`${steamLink}`, '_blank') : changeGame(name)
      }}
    >
      <div className={styles.gameCard}>
        <span className={styles.gamePreview}>
          {/* <span className={styles.gameImg} /> */}
          <Image
            propName='gameCardImg'
            alt='Game Card Banner'
            imageClassName={styles.resetImage}
            aspectRatio={2.48}
            renderWrapper={({ children }) => {
                // extract url from this particular image stored in react bricks repo
                const url = isAdmin && !previewMode ? '' : Object.values(Object.values(Object.values(children)[4].children[0])[4])[0];
                return isAdmin && !previewMode ? (
                    <span className={styles.gameImg} style={{zIndex: 0}}>{children}</span>
                  ) : (
                    <span className={styles.gameImg} style={{ backgroundImage: `url(${url})` }}>{children}</span>
                  );
            }}
          />
          <span className={styles.cardFade} />
          <span className={styles.cardBorder} />
        </span>
        <span className={styles.gameTitle}>{name}</span>
      </div>
    </div>
  );
}

GameCard.schema = {
  name: 'GameCard',
  label: 'Game Card',
  hideFromAddMenu: true,
  getDefaultProps: () => ({
    name: 'Game Title Here',
  }),
  sideEditProps: [
    {
      groupName: 'Game Card Info',
      defaultOpen: true,
      props: [
        {
          name: 'name',
          label: 'Game Title',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'summary',
          label: 'Summary of the Game',
          type: types.SideEditPropType.Textarea,
        },
        {
          name: 'embeddedurl',
          label: 'YouTube Trailer Url',
          helperText: 'On YouTube, click on Share, then Embed, then copy the src url without quotations',
          type: types.SideEditPropType.Text,
        },
        {
          name: 'steamLink',
          label: 'Steam Link Url',
          type: types.SideEditPropType.Text,
        },
      ]
    },
  ]
}

export default GameCard;