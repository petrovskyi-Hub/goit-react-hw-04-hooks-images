import PropTypes from 'prop-types';
import errorImage from './sadcat.jpg';
import s from './Error.module.css';

function Error({ texterror }) {
  return (
    <div role="alert" className={s.wrapper}>
      <img className={s.img} src={errorImage} width="280" alt="sadcat" />
      <p text={texterror} className={s.text}>
        {texterror}
      </p>
    </div>
  );
}

Error.propTypes = {
  texterror: PropTypes.string.isRequired,
};

export default Error;
