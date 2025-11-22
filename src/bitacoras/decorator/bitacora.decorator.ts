import { SetMetadata } from '@nestjs/common';

export const BITACORA_KEY = 'bitacora_action';

export const Bitacora = (action: string) =>
  SetMetadata(BITACORA_KEY, action);
