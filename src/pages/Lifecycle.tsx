import React from 'react';

export function Lifecycle() {
  return (
    <div className="bg-white py-24 container">
      <h2 className="text-3xl font-semibold text-center">
        Stately connects each part of the product lifecycle
      </h2>
      <div className="flex pt-12">
        <LifecycleIntroBox num="1" title="Design" color="orange" />
        <LifecycleIntroBox num="2" title="Build" color="blue" />
        <LifecycleIntroBox num="3" title="Ship" color="green" />
        <LifecycleIntroBox num="4" title="Understand" color="purple" />
      </div>
      <div className="flex gap-12 flex-col pt-48">
        <LifecycleHeader num="1" title="Design" color="orange" />
        <DesignSection />
        <LifecycleHeader num="2" title="Build" color="blue" />
        <BuildSection />
        <LifecycleHeader num="3" title="Ship" color="green" />
        <ShipSection />
        <LifecycleHeader num="4" title="Understand" color="purple" />
        <UnderstandSection />
      </div>
    </div>
  );
}

function LifecycleIntroBox({ num, title, color }) {
  return (
    <div className="flex border rounded-md border p-12 w-48 mx-12 align-center justify-center">
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
}

function LifecycleHeader({ num, title, color }) {
  return (
    <div className="flex">
      <div
        className={`flex align-center justify-center rounded-full text-4xl font-bold bg-pink-500  text-white w-12 h-12`}
      >
        {num}
      </div>
      <div className="text-3xl font-semibold pl-12">{title}</div>
    </div>
  );
}

function DesignSection() {
  return <div>Design section content</div>;
}

function BuildSection() {
  return <div>Build section content</div>;
}

function ShipSection() {
  return <div>Ship section content</div>;
}

function UnderstandSection() {
  return <div>Understand section content</div>;
}
