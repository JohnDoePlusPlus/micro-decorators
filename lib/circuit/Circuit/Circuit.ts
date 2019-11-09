import { ClassType } from '../../interfaces/class';

export interface Circuit {
  execute(args: any[], instance: ClassType): any;
}
