import { jsx as _jsx } from "react/jsx-runtime";
// import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import { CircularProgress } from '@material-ui/core';
import './Loading.scss';
// const colorPalete = {
//   orange: '#f88012',
//   white: '#fff',
// }
export const Loading = ({ color, size }) => {
    const style = { '--loading-color': color };
    return (_jsx("div", { className: `loading circular-progress`, style: style, children: _jsx(CircularProgress, { variant: "indeterminate", 
            // sx={{
            //   color: color && colorPalete[color] ? colorPalete[color] : '#fff',
            //   animationDuration: '1500ms',
            //   [`& .${circularProgressClasses.circle}`]: {
            //     strokeLinecap: 'round',
            //   },
            // }}
            size: size, style: { color: 'white' }, thickness: 6 }) })
    // <div className={`loading dot-flashing `} style={style}>
    //   <div className="stage">
    //     <div className="dot-flashing"></div>
    //   </div>
    // </div>
    );
};
Loading.defaultProps = {
    color: 'orange',
    size: 18,
};
export default Loading;
//# sourceMappingURL=Loading.js.map