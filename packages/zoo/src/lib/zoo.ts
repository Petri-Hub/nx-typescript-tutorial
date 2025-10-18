import { getRandomAnimal } from '@ts-demo/animal';
import { formatMessage } from '@ts-demo/util'

export function zoo(): string {
  const result = getRandomAnimal();
  const message = `${result.name} says ${result.sound}!`;
  return formatMessage('ZOO', message);
}