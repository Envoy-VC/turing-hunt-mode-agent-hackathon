import { useCallback, useState } from 'react';

import { useMutation } from 'convex/react';
import { useAccount } from 'wagmi';
import { Route } from '~/app/game';

import { api } from '../../../convex/_generated/api';
import { type Id } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/button';

function exponentialEase(x: number): number {
  // Normalize x to a range of 0 to 1
  const normalizedX = x / 100;
  // Apply an exponential curve: y = (e^(k * normalizedX) - 1) / (e^k - 1)
  const k = 2; // Larger k -> more exponential growth near the end
  const exponentialValue = (Math.exp(k * normalizedX) - 1) / (Math.exp(k) - 1);

  // Scale the result back to the range of 0 to 300
  return exponentialValue * 300;
}

export const mapIntensityToFlame = (intensity: number) => {
  const height = `${String(exponentialEase(intensity))}%`;
  return {
    height,
    animationDuration: `${String(1 + (100 - intensity) / 100)}s`,
  };
};

export const useFlameIntensity = () => {
  const [intensity, setIntensity] = useState(50);

  const updateIntensity = useCallback((newIntensity: number) => {
    setIntensity(Math.max(0, Math.min(100, newIntensity)));
  }, []);

  return { intensity, updateIntensity };
};

export const FireplaceTask = () => {
  const { gameId } = Route.useSearch();

  const { intensity, updateIntensity } = useFlameIntensity();
  const flameStyle = mapIntensityToFlame(intensity);

  const completeTasks = useMutation(api.tasks.completeTask);

  const [message, setMessage] = useState<string | null>(null);

  const { address } = useAccount();

  const onSubmit = async () => {
    setMessage(null);
    if (!address) return;
    if (intensity < 50) {
      setMessage('Flame intensity too low!');
      return;
    }

    if (intensity > 64) {
      setMessage('Flame intensity too high!');
      return;
    }

    await completeTasks({
      gameId: gameId as Id<'games'>,
      task: 'fireplace',
      address,
    });

    setMessage('Task submitted!');
  };

  return (
    <>
      <div className='mb-8 flex justify-center'>
        <div className='relative h-64 w-32 overflow-hidden rounded-full bg-black'>
          <div
            className='absolute right-0 bottom-0 left-0 w-40 -translate-x-[1rem] object-fill'
            style={{
              height: flameStyle.height,
              backgroundImage: 'url(/images/flames.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
      </div>
      <div className='mb-4'>
        <label className='mb-2 block text-yellow-400' htmlFor='intensity'>
          Flame Intensity: {intensity}
        </label>
        <input
          className='flameInput h-2 w-full appearance-none rounded-full bg-gray-700 outline-none'
          id='intensity'
          max='100'
          min='0'
          type='range'
          value={intensity}
          onChange={(e) => updateIntensity(Number(e.target.value))}
        />
      </div>
      <p className='text-center text-sm text-gray-400'>
        Adjust the slider to change the flame&lsquo;s intensity!
      </p>
      <Button variant='secondary' onClick={onSubmit}>
        Submit Task
      </Button>
      {message ? (
        <p className='text-center text-neutral-200'>{message}</p>
      ) : null}
    </>
  );
};
