import mergeSort from './merge-sort.js';

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

export default class Tree {
  constructor(arr) {
    this.root = this.buildTree(this.sort(arr));
  }

  sort(arr) {
    if (!arr || arr.length === 0) return [];
    // remove duplicates
    const result = [];

    arr.forEach((elm) => {
      if (result.includes(elm)) return;
      result.push(elm);
    });

    return mergeSort(result);
  }

  buildTree(arr, start = 0, end = arr.length - 1) {
    if (!arr || arr.length === 0) return null;
    if (start > end) return null;
    const midIndex = Math.floor((end + start) / 2);

    const root = new Node(arr[midIndex]);

    root.left = this.buildTree(arr, start, midIndex - 1);
    root.right = this.buildTree(arr, midIndex + 1, end);

    return root;
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }

  insert(value, root = this.root) {
    // If no value is provided
    if (value === null || value === undefined) {
      throw new Error('Cannot insert null or undefined into the tree');
    }

    if (root === null) return new Node(value);

    if (value === root.data) return root;

    if (value < root.data) {
      root.left = this.insert(value, root.left);
    } else if (value > root.data) {
      root.right = this.insert(value, root.right);
    }

    return root;
  }

  deleteItem(value, root = this.root) {
    if (root === null) return root;

    if (value < root.data) {
      root.left = this.deleteItem(value, root.left);
    } else if (value > root.data) {
      root.right = this.deleteItem(value, root.right);
    } else {
      if (root.left === null) return root.right;
      if (root.right === null) return root.left;

      let successor = root.right;
      while (successor && successor.left) {
        successor = successor.left;
      }
      root.data = successor.data;
      root.right = this.deleteItem(successor.data, root.right);
    }
    return root;
  }

  find(value, root = this.root) {
    if (!root) return null;

    if (value === root.data) return root;

    return value < root.data
      ? this.find(value, root.left)
      : this.find(value, root.right);
  }

  findParent(value, root = this.root) {
    if (!root) return null;
    if (
      (root.left && root.left.data === value) ||
      (root.right && root.right.data === value)
    )
      return root;
    if (value < root.data)
      return root.left ? this.findParent(value, root.left) : null;
    if (value > root.data)
      return root.right ? this.findParent(value, root.right) : null;
  }

  levelOrder(callback) {
    if (!callback) throw new Error('Callback function needed');
    if (!this.root) return;

    const queue = [this.root];

    while (queue.length > 0) {
      const item = queue[0];
      if (item.left) queue.push(item.left);
      if (item.right) queue.push(item.right);
      callback(queue.shift().data);
    }
  }

  inOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');
    if (!root) return;

    this.inOrder(callback, root.left);
    callback(root.data);
    this.inOrder(callback, root.right);
    return;
  }

  preOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');
    if (!root) return;

    callback(root.data);
    this.preOrder(callback, root.left);
    this.preOrder(callback, root.right);
    return;
  }

  postOrder(callback, root = this.root) {
    if (!callback) throw new Error('Callback function needed');
    if (!root) return;

    this.postOrder(callback, root.left);
    this.postOrder(callback, root.right);
    callback(root.data);
    return;
  }

  height(value) {
    const target = typeof value === 'object' ? value : this.find(value);

    if (!target) return null;
    if (!target.left && !target.right) return 0;

    const leftCounter = target.left ? this.height(target.left.data) : 0;
    const rightCounter = target.right ? this.height(target.right.data) : 0;

    return Math.max(leftCounter, rightCounter) + 1;
  }

  depth(value) {
    if (!this.find(value)) return null;
    let target = value;
    let counter = 0;

    while (this.findParent(target)) {
      counter++;
      target = this.findParent(target).data;
    }

    return counter;
  }

  isBalanced(node = this.root) {
    if (!node) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (Math.abs(leftHeight - rightHeight) > 1) return false;

    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  rebalance() {
    const arr = [];
    this.inOrder((elm) => arr.push(elm));

    this.root = this.buildTree(arr);
  }
}
