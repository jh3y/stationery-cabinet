// Some basic Array utility functions
const includes = (arr, id) => arr.filter(i => i.id === id).length > 0
const find = (arr, id) => arr.filter(i => i.id === id)[0]


class Node {
  constructor(id, children) {
    this.id = id
    this.children = children
  }
  getDescendants = () => {
    let descendants = []
    // recurse through the children
    const addDescendants = (child) => {
      for (let c = 0; c < child.children.length; c++) {
        // if the child is already included or child has the same ID as origin don't include
        if (descendants.includes(child.children[c].id) || this.id === child.children[c].id) return
        descendants.push(child.children[c].id)
        addDescendants(child.children[c])
      }
    }
    addDescendants(this)
    return descendants
  }
  getDescendantCount = () => {
    return this.getDescendants().length
  }
}

class Graph {
  constructor(nodes) {
    this.nodes = nodes
  }
  hasLoop = () => {
    let looping = false
    const findLoop = (node, visited = []) => {
      const { children, id } = node
      for (let c = 0; c < children.length; c++) {
        const child = children[c]
        let visitedNodes = [...visited, node, ...child.children]
        const filtered = visitedNodes.filter(v => v.id === child.id)
        if (filtered.length) {
          looping = true
          break
        } else {
          findLoop(child, visitedNodes)
        }
      }
    }
    // find a loop based on the root node
    // the root node is always the first node in the nodes Array
    // this could be made a little better by defining a root param or the likes
    findLoop(this.nodes[0])
    return looping
  }
}




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
  // Dirty way to repopulate the children with node instances
  // This is in place so we don't have to pass graph down to the node instance
  const enhanceChildren = () => {
    for (let n of nodes) {
      const childNodes = []
      for (let c of n.children) {
        childNodes.push(find(nodes, c))
      }
      n.children = childNodes
    }
  }
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
      '1': ['2', '3', '4'],
      '2': ['1'],
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
    describe('detecting loops', () => {
      it('detects no loop for single node graph', () => {
        assert.equal(singleNodeGraph.hasLoop(), false)
      })
      it('detects no loop for multi level graph', () => {
        assert.equal(twoLevelGraph.hasLoop(), false)
      })
      it('detects loop in a bidirectional graph', () => {
        assert.equal(bidirectionalGraph.hasLoop(), true)
      })
      it('detects loop in simple looped graph', () => {
        assert.equal(loopingGraph.hasLoop(), true)
      })
      it('detects loop with graph where nodes loop to ancestor', () => {
        assert.equal(ancestoralLoopingGraph.hasLoop(), true)
      })
    })
  })
  describe('Node', () => {
    describe('returning descendants', () => {
      it('returns empty set for single node graph', () => {
        assert.deepEqual(singleNodeGraph.nodes[0].getDescendants(), [])
      })
      it('returns correct set for multi level graph', () => {
        expect(twoLevelGraph.nodes[0].getDescendants()).to.include.members(['2', '3'])
      })
      it('returns correct descendants for a node in a looping graph', () => {
        expect(bidirectionalGraph.nodes[0].getDescendants()).to.include.members(['2'])
        expect(loopingGraph.nodes[1].getDescendants()).to.include.members(['1'])
        expect(ancestoralLoopingGraph.nodes[0].getDescendants()).to.include.members(['2', '3', '4', '5'])
      })
    })
    it('returns correct descendant count', () => {
      assert.equal(twoLevelGraph.nodes[0].getDescendantCount(), 2)
      assert.equal(loopingGraph.nodes[0].getDescendantCount(), 3)
    })
  })
})


mocha.run()