export enum EACH_ORDER_TYPE {
  FIRST = 'first', // 顺序
  LAST = 'last' // 倒序
}

/**
 * 历史记录栈
 */
export class History<T> {
  cacheQueue: T[]
  step: number
  constructor(cacheQueue: T[]) {
    this.cacheQueue = cacheQueue
    this.step = cacheQueue.length - 1
  }

  /**
   * 遍历cacheQueue
   * @param cb 遍历执行回调
   */
  each(cb?: (ele: T, i: number) => void, order = EACH_ORDER_TYPE.FIRST) {
    if (order === EACH_ORDER_TYPE.FIRST) {
      for (let i = 0; i <= this.step; i++) {
        cb?.(this.cacheQueue[i], i)
      }
    } else if (order === EACH_ORDER_TYPE.LAST) {
      for (let i = this.step - 1; i >= 0; i--) {
        cb?.(this.cacheQueue[i], i)
      }
    }
  }

  /**
   * 对缓存进行排序
   */
  sort(cb: (a: T, b: T) => number) {
    this.cacheQueue.sort(cb)
  }

  /**
   * 添加数据
   * @param data
   */
  add(data: T) {
    // 如果在回退时添加数据就删除暂存数据
    if (this.step !== this.cacheQueue.length - 1) {
      this.cacheQueue.length = this.step + 1
    }
    this.cacheQueue.push(data)
    this.step = this.cacheQueue.length - 1
  }

  /**
   * 根据条件删除
   * @param key 删除条件匹配的key
   * @param value 删除条件匹配的值
   */
  delete<K extends keyof T>(key: K, value: T[K]) {
    this.cacheQueue = this.cacheQueue.filter((item) => item[key] !== value)
  }

  /**
   * 根据坐标删除
   * @param index 下标
   */
  deleteByIndex(index: number) {
    this.cacheQueue.splice(index, 1)
  }

  /**
   * 后退
   */
  undo() {
    if (this.step >= 0) {
      this.step--
      return this.cacheQueue[this.step]
    }
  }

  /**
   * 前进
   */
  redo() {
    if (this.step < this.cacheQueue.length - 1) {
      this.step++
      return this.cacheQueue[this.step]
    }
  }

  /**
   * 清空
   */
  clean() {
    this.cacheQueue = []
    this.step = -1
  }
}
