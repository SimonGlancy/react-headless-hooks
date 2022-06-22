import { GenericObject, Paths } from '../../types';

const constructNewPath = (key: string, path: string) =>
  `${path}${path ? '.' : ''}${key}`;

const getObjectPaths = <T extends GenericObject>(
  obj: T,
  path: string = ''
): string[] => {
  switch (typeof obj) {
    case 'object': {
      const reduced = Object.entries(obj).reduce<string[]>(
        (acc, [key, value]) => {
          const newPath = constructNewPath(key, path);
          if (typeof value === 'object') {
            return [...acc, ...getObjectPaths(value as GenericObject, newPath)];
          }
          return [...acc, newPath];
        },
        []
      );

      return reduced;
    }
    default:
      return [];
  }
};

export default getObjectPaths;
