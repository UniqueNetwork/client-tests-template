import globalConfig  from './global';
// @ts-ignore
import localConfig from './local';

export const config = localConfig ? { ...localConfig } : { ...globalConfig }
