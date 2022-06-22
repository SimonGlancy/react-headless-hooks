import { SelectTypeEnum } from '../useSelected.types';

const normaliseData = <Data>(
  data: Data[],
  getId: (item: Data) => string,
  selectType: SelectTypeEnum,
  valueType: 'item' | true | false
) => {
  return data.reduce((dataAsObject, item, index) => {
    const id = selectType === SelectTypeEnum.BY_ID ? getId(item) : index;
    return {
      ...dataAsObject,
      [id]: valueType === 'item' ? item : valueType,
    };
  }, {});
};

export default normaliseData;
