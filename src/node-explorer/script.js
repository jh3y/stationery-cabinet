// Some basic Array utility functions
const includes = (arr, id) => arr.filter(i => i.id === id).length > 0
const find = (arr, id) => arr.filter(i => i.id === id)[0]


class Node {
  constructor(id, children) {
    this.id = id
    this.children = children
  }
  getChildren = () => {
    let children = []
    const addChildren = (child) => {
      for (let c = 0; c < child.children.length; c++) {
        if (children.includes(child.children[c].id) || this.id === child.children[c].id) return
        children.push(child.children[c].id)
        addChildren(child.children[c])
      }
    }
    addChildren(this)
    return children
  }
  getChildCount = () => {
    return this.getChildren().length
  }
}

class Graph {
  constructor(nodes) {
    this.nodes = nodes
  }
  hasLoop = () => {
    let looping = false
    // Get the children of the Node
    const findChildLoop = (node, visited = []) => {
      const { children, id } = node
      // For any of the children, check to see if visited includes one of their children
      for (let c = 0; c < children.length; c++) {
        const child = children[c]
        let visitedNodes = [...visited, node, ...child.children]
        const filtered = visitedNodes.filter(v => v.id === child.id)
        if (filtered.length) {
          looping = true
          break
        } else {
          findChildLoop(child, visitedNodes)
        }
      }
    }
    findChildLoop(this.nodes[0])
    return looping
  }
}



/**
 * Basic unit tests for functions
 */
mocha.setup('bdd')

/**
 * returns a graph created from given config
 * @param {Object} config - configuration object for creating a graph
 */
const createGraph = config => {
  const nodes = []
  /**
   * return a node either from a previously generated list or from scratch
   * @param {String} id - id of node to create
   */
  const generateNode = (id) => {
    let node
    const children = config[id]
    if (!includes(nodes, id)) nodes.push(new Node(id, children))
    for (const c of children) {
      const filtered = nodes.filter(n => n.id === c)
      if (!includes(nodes, c)) {
        nodes.push(new Node(c, config[c]))
      }
    }
  }
  // Dirty way to repopulate the children with node references
  // This is in place so we don't have to pass graph down the instance
  const enhanceChildren = () => {
    for (let n of nodes) {
      const childNodes = []
      for (let c of n.children) {
        childNodes.push(find(nodes, c))
      }
      n.children = childNodes
    }
  }
  // Iterate through config keys and create nodes && children if necessary
  for (let n of Object.keys(config)) {
    generateNode(n)
  }
  enhanceChildren()
  const graph = new Graph(nodes)
  return graph
}

const assert = chai.assert
const expect = chai.expect
let singleNodeGraph
let twoLevelGraph
let loopingGraph
let ancestoralLoopingGraph
let bidirectionalGraph
describe('Exercise', () => {
  before(() => {
    singleNodeGraph = createGraph({'1': []})
    twoLevelGraph = createGraph({
      '1': ['2', '3'],
      '2': [],
      '3': []
    })
    loopingGraph = createGraph({
      '1': ['2', '3'],
      '2': ['4'],
      '3': [],
      '4': ['1']
    })
    ancestoralLoopingGraph = createGraph({
      '1': ['2', '3'],
      '2': ['4'],
      '3': ['4'],
      '4': ['5'],
      '5': ['1']
    })
    bidirectionalGraph = createGraph({
      '1': ['2'],
      '2': ['1']
    })
  })
  describe('Graph', () => {
    it('detects loop correctly', () => {
      assert.equal(singleNodeGraph.hasLoop(), false)
      assert.equal(twoLevelGraph.hasLoop(), false)
      assert.equal(loopingGraph.hasLoop(), true)
      assert.equal(ancestoralLoopingGraph.hasLoop(), true)
      assert.equal(bidirectionalGraph.hasLoop(), true)
    })
  })
  describe('Node', () => {
    it('returns correct children', () => {
      assert.deepEqual(singleNodeGraph.nodes[0].getChildren(), [])
      expect(twoLevelGraph.nodes[0].getChildren()).to.include.members(['2', '3'])
      expect(loopingGraph.nodes[1].getChildren()).to.include.members(['4'])
      expect(ancestoralLoopingGraph.nodes[0].getChildren()).to.include.members(['2', '3', '4', '5'])
    })
    it('returns correct child count', () => {
      assert.equal(twoLevelGraph.nodes[0].getChildCount(), 2)
      assert.equal(loopingGraph.nodes[0].getChildCount(), 3)
    })
  })
})


mocha.run()