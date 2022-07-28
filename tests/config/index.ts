import globalConfig  from './global';
// @ts-ignore
import * as localConfig from './local';

export const config = localConfig ? { ...localConfig } : { ...globalConfig }
