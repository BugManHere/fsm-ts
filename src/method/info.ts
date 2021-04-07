import { configType, inputDataType, modelType } from '@/interfaces';
import { StateInfoType } from '@/interfaces/class';
import { reactive, computed } from '@vue/reactivity';

export class StateInfo implements StateInfoType {
  // 状态机配置
  config: configType;
  // 状态机输入
  input: inputDataType = {};

  /** 简单数据 */
  // 定义为显性功能的model合集
  funcDefine_active: { value: any } = { value: undefined };
  // 定义为隐性功能的model合集
  funcDefine_inertia: { value: any } = { value: undefined };
  // 所有model的identifier合集
  identifierArr: { value: any } = { value: undefined };
  // funcDefine的对象版本，根据identifier找到对应的model
  funcDefineMap: { value: any } = { value: undefined };
  // hideMap的反义，根据被隐藏的stateName找到具有隐藏关系的stateName合集
  hideMapReverse: { value: any } = { value: undefined };
  // 根据identifier获取statusName列表
  statusNameMap: { value: any } = { value: undefined };
  // 根据identifier获取当前状态的更多信息，经过一层隐藏状态处理

  /** 复合数据 */
  // 根据stateName获取对应的identifier
  stateNameToId: { value: any } = { value: undefined };
  // 根据identifier与value获取statusName
  valToStatusName: { value: any } = { value: undefined };
  // 根据identifier获取statusName指向关系
  statusLoop: { value: any } = { value: undefined };
  // 根据identifier获取statusName指向关系，无隐藏状态处理
  fakeStatusLoop: { value: any } = { value: undefined };
  // model的当前指向statusName
  statusDirectionMap: { value: any } = { value: undefined };
  // 获取没有指向的model数组
  blindModelArr: { value: any } = { value: undefined };
  // 根据identifier获取当前状态的更多信息，没有经过隐藏状态处理
  $_statusMap: { value: any } = { value: undefined };
  // 根据identifier获取当前状态的更多信息，经过一层隐藏状态处理
  statusMap: { value: any } = { value: undefined };
  // 隐藏的stateName数组
  hideStateNameArr: { value: any } = { value: [] };
  // 根据identifier获取当前状态的更多信息，没有经过隐藏状态处理
  fakeStatusMap: { value: any } = { value: undefined };
  // 根据identifier与value获取statusName，没有经过隐藏状态处理
  valToFakeStatusName: { value: any } = { value: undefined };
  // 某一status的详细信息
  statusInfoMap: { value: any } = { value: undefined };
  // 指向status的详细信息
  nextStatusInfoMap: { value: any } = { value: undefined };

  /** 缓存数据 */
  hideStateNameJson: string = '[]';
  constructor(config: configType, input: inputDataType) {
    // 记下状态配置
    this.config = reactive(config);
    this.input = reactive(input);
    this.updateInfo();
  }
  updateConfig(config: configType): void {
    // 记下状态配置
    this.config = reactive(config);
  }
  updateInput(input: inputDataType): void {
    // 记下状态机输入
    this.input = reactive({
      ...this.input,
      ...input
    });
    this.updateInfo();
  }
  updateInfo() {
    /** 简单数据 */
    this.funcDefine_active = computed(() => {
      return this.config.funcDefine.filter((model) => model.type.includes('active'));
    });

    this.funcDefine_inertia = computed(() => {
      return this.config.funcDefine.filter((model) => model.type.includes('inertia'));
    });

    this.identifierArr = computed(() => {
      return this.config.funcDefine.map((model) => model.identifier);
    });

    this.funcDefineMap = computed(() => {
      const result: { [prpopName: string]: modelType } = {};
      this.config.funcDefine.forEach((model) => {
        const { identifier } = model;
        result[identifier] = model;
      });
      return result;
    });

    this.hideMapReverse = computed(() => {
      const result: { [prpopName: string]: string[] } = {};
      const { hideMap } = this.config;
      for (const stateName in hideMap) {
        hideMap[stateName].forEach((hideStateName) => {
          result[hideStateName] ? result[hideStateName].push(stateName) : (result[hideStateName] = [stateName]);
        });
      }
      return result;
    });

    this.statusNameMap = computed(() => {
      const result: { [prpopName: string]: string[] } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        result[identifier] = Object.keys(model.statusDefine).filter((statusName) => statusName !== 'undefined');
      });
      return result;
    });

    /** 复合数据 */
    this.stateNameToId = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        this.statusNameMap.value[identifier].forEach((statusName: string) => {
          const stateName = `${identifier}_${statusName}`;
          result[stateName] = identifier;
        });
      });
      return result;
    });

    this.valToStatusName = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        result[identifier] = getStatusName(model, this.hideStateNameJson, this.statusNameMap, this.input, true);
      });
      return result;
    });

    this.statusLoop = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        // 指向关系
        const map: { [prpopName: string]: any } = model.map;
        // 当前statusName
        let statusName: string = this.$_statusMap.value[identifier].statusName;
        // 存放statusName用
        const statusNameArr = [];
        // 存放已检查的statusName用
        const checkStatusNameArr: string[] = [];
        if (map) {
          // status指向
          let directionStatusName = String(map[statusName]);
          // 再次指向原点时推出，形成闭环
          while (!checkStatusNameArr.includes(directionStatusName)) {
            // 下一个statusName
            statusName = directionStatusName;
            const stateName = `${identifier}_${statusName}`;
            // 按顺序存入数组
            this.hideStateNameArr.value.includes(stateName) || statusNameArr.push(directionStatusName);
            checkStatusNameArr.push(directionStatusName);
            // 更新指向
            directionStatusName = String(map[statusName]);
          }
        }
        // 无意义的指向改为'undefined'
        statusNameArr.length === 0 && statusNameArr.push('undefined');
        result[identifier] = statusNameArr;
      });
      return result;
    });

    this.fakeStatusLoop = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        // 指向关系
        const map: { [prpopName: string]: any } = model.map;
        // 当前statusName
        let statusName: string = this.$_statusMap.value[identifier].statusName;
        // 存放statusName用
        const statusNameArr = [];
        // 存放已检查的statusName用
        const checkStatusNameArr: string[] = [];
        if (map) {
          // status指向
          let directionStatusName = String(map[statusName]);
          // 再次指向原点时推出，形成闭环
          while (!checkStatusNameArr.includes(directionStatusName)) {
            // 下一个statusName
            statusName = directionStatusName;
            // 按顺序存入数组
            statusNameArr.push(directionStatusName);
            checkStatusNameArr.push(directionStatusName);
            // 更新指向
            directionStatusName = String(map[statusName]);
          }
        }
        // 无意义的指向改为'undefined'
        statusNameArr.length === 0 && statusNameArr.push('undefined');
        result[identifier] = statusNameArr;
      });
      return result;
    });

    this.statusDirectionMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      // 遍历功能，提取model当前指向statusName
      this.identifierArr.value.forEach((identifier: string) => {
        const directionStatusName = this.statusLoop.value[identifier].find((statusName: string) => {
          const stateName = `${identifier}_${statusName}`; // 获取指向stateName
          return !this.hideStateNameArr.value.includes(stateName); // 如果没被隐藏，则返回
        });
        result[identifier] = directionStatusName || this.$_statusMap.value[identifier].statusName; // 如果都被隐藏， 则返回当前status
      });
      return result;
    });

    this.blindModelArr = computed(() => {
      return this.identifierArr.value.filter((identifier: string) => {
        // 当前statusName
        const statusName = this.statusMap.value[identifier].statusName;
        // 指向statusName
        const directionStatusName = this.statusDirectionMap.value[identifier];
        // 如果指向statusName为'undefined'或当前statusName，则认为指向无效
        return directionStatusName === 'undefined' || directionStatusName === statusName;
      });
    });

    this.$_statusMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        const json = model.json;
        const currentVal: number = Number(this.input[json]) || 0;
        let statusName: string = this.valToStatusName.value[identifier][currentVal];
        let status = model.statusDefine[statusName];
        // 如果statusName不存在，返回'undefined'
        if (!status) {
          statusName = 'undefined';
          status = model.statusDefine.undefined;
        }
        // 当前stateName
        const stateName = `${identifier}_${statusName}`;
        result[identifier] = {
          statusName,
          stateName,
          status
        };
      });
      return result;
    });

    this.statusMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      // 获取当前被隐藏的stateName
      const hideStateNameArr = this.hideStateNameArr.value;
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        // 获取未经过隐藏状态处理的状态信息
        let { statusName, stateName, status } = this.$_statusMap.value[identifier];
        // 如果状态被隐藏
        if (hideStateNameArr.includes(stateName)) {
          // 获取新的指向
          const directionStatusName = this.statusDirectionMap.value[identifier]; // model的指向statusName
          // 如果没有指向，则返回'undefined'
          statusName = statusName === directionStatusName ? 'undefined' : directionStatusName;
          stateName = `${identifier}_${statusName}`;
          status = model.statusDefine[statusName];
        }
        result[identifier] = {
          statusName,
          stateName,
          status
        };
      });
      return result;
    });

    this.hideStateNameArr = computed(() => {
      const result: string[] = [];
      this.identifierArr.value.forEach((identifier: string) => {
        const statusName = this.$_statusMap.value[identifier].statusName;
        const stateName = `${identifier}_${statusName}`;
        const hideStateNames = this.config.hideMap[stateName];
        hideStateNames && result.push(...hideStateNames);
      });
      return result;
    });

    this.fakeStatusMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      // 根据字段值，返回当前状态信息
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        const json = model.json;
        // 字段值
        const currentVal = this.input[json];
        // 当前statusName
        let statusName = this.valToFakeStatusName.value[identifier][currentVal];
        let status = model.statusDefine[statusName];
        // 如果statusName不存在，返回'undefined'
        if (!status) {
          statusName = 'undefined';
          status = model.statusDefine.undefined;
        }
        // 当前stateName
        const stateName = `${identifier}_${statusName}`;
        result[identifier] = {
          statusName,
          stateName,
          status
        };
      });
      return result;
    });

    this.valToFakeStatusName = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        result[identifier] = getStatusName(model, this.hideStateNameJson, this.statusNameMap, this.input, false);
      });
    });

    this.statusInfoMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        const json = model.json;
        result[identifier] = {};
        this.statusNameMap.value[identifier].forEach((statusName: string) => {
          const status = model.statusDefine[statusName];
          if (!status) return;
          const customize = status.customize;
          const moreCommand = status.moreCommand;
          let setData = moreCommand || {};
          setData[json] = status.value;
          result[identifier][statusName] = {
            statusName,
            status,
            json,
            setData,
            customize
          };
        });
      });
      return result;
    });

    this.nextStatusInfoMap = computed(() => {
      const result: { [prpopName: string]: any } = {};
      this.config.funcDefine.forEach((model) => {
        const identifier = model.identifier;
        const json = model.json;
        let statusName = this.statusDirectionMap.value[identifier]; // model的指向statusName
        let status = model.statusDefine[statusName];
        if (!status) {
          statusName = 'default';
          status = model.statusDefine[statusName];
        }
        const customize = status.customize;
        const moreCommand = status.moreCommand;
        let setData = moreCommand || {};
        setData[json] = status.value;
        result[identifier] = {
          statusName,
          status,
          json,
          setData,
          customize
        };
      });
      return result;
    });
  }
  statusMsgGetter(identifier) {
    return this.statusMap.value[identifier];
  }
  statusNameGetter(identifier) {
    return this.statusMsgGetter(identifier).statusName;
  }
  modelAllGetter(mainType, secondType) {
    const isActive = mainType === 'active';
    const type = isActive ? 'funcDefine_active' : 'funcDefine_inertia';
    return this[type].value.filter((model) => model.type === `${mainType}-${secondType}`);
  }
}

function getStatusName(
  model: modelType,
  hideStateNameJson: string,
  statusNameMap: { value: any },
  input: inputDataType,
  checkHide: Boolean
): {
  [propName: string]: string;
} {
  const result: { [prpopName: string]: any } = {};
  // 获取被隐藏的stateName
  const hideStateNameArr = JSON.parse(hideStateNameJson);

  const identifier = model.identifier;
  // 获取statusName列表
  const statusNameArr = statusNameMap.value[identifier];
  // 轮询每个status
  statusNameArr.forEach((statusName: string) => {
    if (statusName === 'undefined') return;
    const stateName = `${identifier}_${statusName}`;
    // 隐藏的状态不参与
    if (checkHide && hideStateNameArr.includes(stateName)) {
      return;
    }
    const val = model.statusDefine[statusName].value;
    const beforeStatusName = result[val];
    // 是否存在同源状态（JSON取值相等）
    if (beforeStatusName) {
      const commandBefore = model.statusDefine[beforeStatusName].moreCommand;
      const commandCurrent = model.statusDefine[statusName].moreCommand;
      const currentType = mapRelation(commandCurrent, input);
      // 同源状态是否有moreCommand
      if (commandBefore) {
        const beforeType = mapRelation(commandBefore, input); // 状态是否满足
        let isCurrent = false;
        // 判断两个同源状态之间的关系
        switch (mapRelation(commandCurrent, commandBefore)) {
          // 难点重点，看悟性了
          case 0:
          case 1:
            switch (currentType) {
              case 0:
                isCurrent = beforeType === 0;
                break;
              case 1:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          case 2:
            switch (currentType) {
              case 0:
                isCurrent = beforeType === 0;
                break;
              case 2:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          case 3:
            switch (currentType) {
              case 1:
                isCurrent = beforeType !== 2;
                break;
              default:
                isCurrent = true;
                break;
            }
            break;
          default:
            isCurrent = true;
            break;
        }
        isCurrent && (result[val] = statusName);
      } else {
        currentType === 2 && (result[val] = statusName);
      }
    } else {
      result[val] = statusName;
    }
  });
  return result;
}

/**
 * @description 获取对象之间的关系
 * @return Number 0.相离 1.相交 2.被包含 3.包含 4.相等
 */
function mapRelation(fromMap: { [propName: string]: any }, toMap: { [propName: string]: any }) {
  const fromMapKey = Object.keys(fromMap);
  const fromLen = fromMapKey.length;
  const toMapKey = Object.keys(toMap);
  const toLen = toMapKey.length;
  let num = 0;
  fromMapKey.forEach((item) => {
    if (fromMap[item] === toMap[item]) {
      num += 1;
    }
  });
  if (!num) {
    return 0;
  } else if (fromLen - num) {
    if (num === toLen) return 3;
    return 1;
  } else if (fromLen < toLen) {
    return 2;
  }
  return 4;
}
