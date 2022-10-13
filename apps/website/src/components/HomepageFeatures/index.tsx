import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Make Editor.js More Powerful',
    description: (
      <>
        PDEJS realizes to create{' '}
        <a href="https://editorjs.io" target="_blank" rel="noreferrer">
          Editor.js
        </a>{' '}
        tools is easier. This makes the development of using Editor.js more
        efficient.
      </>
    ),
  },
  {
    title: 'Declarative Programming',
    description: (
      <>
        Get benefits from declarative programming through using of the{` `}
        <a
          href="https://reactjs.org/docs/introducing-jsx.html#gatsby-focus-wrapper"
          target="_blank"
          rel="noreferrer"
        >
          JSX
        </a>
        . It clearifies the relationship between UI and the implements and
        simplifies complex state management by almost the same way{' '}
        <a href="https://preactjs.com">Preact</a>.
      </>
    ),
  },
  {
    title: 'No dependence on UI Libraries',
    description: (
      <>
        PDEJS does not depend on any UI Libraries like React, Vue, Ember, etc.
        It supports to create UI by pure JavaScript(and JSX). Of course, it
        works well with TypeScript.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
