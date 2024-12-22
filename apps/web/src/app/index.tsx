import { useRef, useState } from 'react';

import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useOnClickOutside } from 'usehooks-ts';
import { z } from 'zod';
import { HomeMenu } from '~/components';

const routeApi = getRouteApi('/');

export const HomeComponent = () => {
  const { start } = routeApi.useSearch();

  const [gameStarted, setGameStarted] = useState(start ?? false);

  const ref = useRef(null);

  const handleClickOutside = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className='!m-0 !p-0'>
      <img
        alt='background'
        className='absolute h-screen w-full object-cover'
        src='/background.png'
      />
      <div className='absolute top-[18%] right-1/2 z-[1] translate-x-1/2'>
        <div className='text-center font-storm text-[8rem] leading-[1] text-white'>
          Turing
          <br />
          Hunt
        </div>
      </div>
      <div className='absolute right-1/2 bottom-[30%] z-[1] translate-x-1/2'>
        {!gameStarted ? (
          <div ref={ref} className='animate-pulse text-neutral-200'>
            Click anywhere on the screen to start the game
          </div>
        ) : (
          <HomeMenu />
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
  validateSearch: z.object({
    start: z.boolean().optional(),
  }),
});
