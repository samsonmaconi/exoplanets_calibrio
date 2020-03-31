import React from 'react'
import './Loader.scss';

const Loader = ({ loading }) => {
  return (
    <div
      className={`loader`}
      style={{ position: 'relative' }}
    >
      <div className={`loader-outer-wrapper${loading ? '' : ' loader-outer-wrapper-hidden'}`}>
        <div className="loader-inner-wrapper">
          <p className="loading-text" style={{ margin: 20 }}>
            <span>Loading</span>
            <span children="." />
            <span children="." />
            <span children="." />
          </p>
        </div>
      </div>
    </div>
  )
}

export default Loader
