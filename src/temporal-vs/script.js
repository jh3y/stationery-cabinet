import React, {
  Fragment,
  useState,
  useEffect,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const SCENARIOS = [
  {
    title: 'Homegrown Scripts and Queues',
    content: () => (
      <Fragment>
        <h2 className="font-bold">
          Most developers hand-write async flows using queues and job
          processors.
        </h2>
        <p>
          This often requires requisitioning new infrastructure, and
          hand-writing often buggy, not-well-distributed and hard-to-test code.
          Temporal offers a battle tested framework enabling you to capture and
          define your business logic in a structured way and run it it atop a
          single set of infrastructure at massive scale. It allows developers to
          focus on your actual business requirements and not plumbing work.
        </p>
      </Fragment>
    ),
  },
  {
    title: 'DAG-based Workflow Engines',
    content: () => (
      <Fragment>
        <h2 className="font-bold mb-3">
          DAG-based Workflow Engines like Airflow/Prefect/Luigi are pipeline
          solutions aimed at data scientists running at a small-to-medium scale.
        </h2>
        <p className="mb-3">
          Temporal provides a code-first development environment which can be
          used to build data pipelines, orchestrate microservices, provision
          resources and much more at any scale. Code written with Temporal is
          executed directly which enables users to easily integrate Temporal
          into their existing development, testing, and debugging environmentss.
        </p>
        <p className="mb-3">
          While Temporal is a great option for data pipelines, this encompasses
          only a very small subset of its use cases. Temporal enables
          development of applications of all shapes and sizes, regardless of
          scale.
        </p>
        <p className="mb-3">
          Temporal targets developers. All code written with Temporal runs
          directly, eliminating any extra compilation steps often required by
          DAG-based solutions. This provides extra flexibility which is
          impossible to achieve with more rigid DAG based systems.
        </p>
      </Fragment>
    ),
  },
  {
    title: 'BPM Engines',
    content: () => (
      <Fragment>
        <h2 className="font-bold mb-4">
          BPM Engines like Camunda Zeebe define their workflows using a
          flow-chart based DSL such as BPMN.
        </h2>
        <p className="mb-3">
          Flow-chart based workflow DSLs suffer from being bound to a specific
          set of features and capabilities provided by the underlying workflow
          language they use. Even though they promote the visualization aspect
          of workflow design, the actual execution semantics are expressed as a
          mix of programming and expression languages which are enforced by the
          specific runtime implementation. Temporal does not suffer from these
          types of restrictions enabling you to fully define your workflows
          using a programming language. This provides a high level of
          flexibility not only with defining your workflow logic but also
          testing and debugging in the development environment of your choice.
        </p>
        <p className="mb-3">
          BPM engines translate workflow definition markup into code, which
          requires additional compilation steps. This kind of code generation is
          approached differently by each runtime engine using tools they chose.
          Temporal eliminates the intermediate compilation steps enabling you to
          express your workflow logic directly in code. In addition, Temporal
          provides you with high-level concepts such as asynchronous
          invocations, retries, error propagation and compensation which can be
          expressed much easier than in BPM-based solutions, especially for
          larger workflows.
        </p>
      </Fragment>
    ),
  },
  {
    title: 'JSON/YAML-based Workflow Engines',
    content: () => (
      <Fragment>
        <h2 className="font-bold mb-4">
          JSON/YAML-based Workflow Engines like AWS Step Functions are aimed at
          high scale, light complexity applications.{' '}
        </h2>
        <p className="mb-3">
          Workflow engines based on declarative DSLs contain a very small set of
          features and typically target very specific technology domains.
          Similar to BPM-based engines, they require additional compilation
          steps to translate the workflow definitions into executable code. They
          also often target stateless orchestration use cases only. Temporal not
          only eliminates the intermediate compilation steps allowing you to
          express your workflow logic directly in code, but it also targets a
          much larger set of use cases. It can be used to build data pipelines,
          orchestrate microservices, provision resources and much more. Code
          written with Temporal is executed directly which enables users to
          easily develop, debug, and test their workflows using a development
          environment of their choice.
        </p>
        <p className="mb-3">
          Step Functions can be a great service for non-developers or technical
          managers to define business logic without writing code. While Step
          Functions is a great service there is no open source implementation
          provided which puts it into a much different class compared to
          Temporal.
        </p>
        <p className="mb-3">
          Temporal is an open source platform which enables you to deploy your
          workflow applications on environments of your choice. Step Functions
          on the other hand is only available as a service from AWS.
        </p>
        <p className="mb-3">
          Temporal targets developers and all code written with Temporal runs
          directly instead of being translated from a DSL. This gives you
          flexibility which is impossible to achieve with more rigid DSL based
          systems.
        </p>
        <p className="mb-3">
          Temporal provides you with high-level concepts such as asynchronous
          invocations, retries, error propagation and compensation which can be
          expressed much easier and are often not existing in domain-specific
          DSL based solutions.
        </p>
      </Fragment>
    ),
  },
]

const Versus = () => {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <select
        className="bg-black"
        onChange={e => setIndex(parseInt(e.target.value, 10))}>
        {SCENARIOS.map((scenario, index) => (
          <option key={`option--${scenario.title}`} value={index}>
            {scenario.title}
          </option>
        ))}
      </select>
      <ul
        className="w-1/2 h-1/2 relative"
        style={{
          '--index': index,
          '--count': SCENARIOS.length,
        }}>
        {SCENARIOS.map((scenario, contentIndex) => {
          const Content = scenario.content
          return (
            <li
              className={`${index === contentIndex ? 'selected' : ''} ${
                contentIndex === index - 1 ? 'before' : ''
              } ${contentIndex === index + 1 ? 'after' : ''} h-full w-full`}
              key={`content--${scenario.title}`}
              style={{ '--idx': contentIndex }}>
              <Content />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const App = () => {
  return (
    <section>
      <h1 className="uppercase">Temporal Vs.</h1>
      <Versus />
    </section>
  )
}

render(<App />, ROOT_NODE)
