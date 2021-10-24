import React, { useEffect, useState, useRef } from 'react'
import './App.css';
import io from 'socket.io-client'
import { MdCloudUpload } from 'react-icons/md'
import axios from 'axios'
import jimp from 'jimp'

const Slider = ({ onChangeSider, value, changeSlider, name }) => {
  return (
    <div className='mt-2'>
      <label htmlFor='myRange' className='flex-row spaces'><input type='number' style={{ width: 40 }} value={value} onChange={(e) => {
        onChangeSider(e)
        changeSlider(e)
      }} /><span>{name}</span></label>
      <input type="range" min={name === 'contrast' ? "-50" : "0"} max={name === 'contrast' ? "50" : '100'} value={value} onChange={(e) => onChangeSider(e)} onMouseUp={() => changeSlider()} class="slider" id="myRange" />
    </div>

  )
}

const NavBar = ({ setHeight, setWidth, ratio, width, height }) => {
  return (
    <div className='container'>
      <div className='left'>

      </div>
      <div className='right'>

      </div>
    </div>
  )
}


const Board = ({brightenVal, ligthenVal, onChangeBrigten, onChangeLighten, onChageDarken, darkenVal, changeSlider, onChageSatration, contrastVal, saturationVal, onChangeContrast, orginalMetaData, setRatio, ratio, DPI, mainFile, sizeFile, size, contrast, onAddImage, setWidth, width, setHeight, height, file, fileChoose }) => {


  const prevWidth = useRef()
  const prevHeight = useRef()


  useEffect(() => {
    if (fileChoose) {
      setHeight(fileChoose.height)
      setWidth(fileChoose.width)
      prevWidth.current = fileChoose.width
      prevHeight.current = fileChoose.height
      setRatio(fileChoose.width / fileChoose.height)
    }
  }, [fileChoose])


  return (
    <div className='board-container'>
      <div className='container-images'>
        <div className='box-details flex-left'>
          <h2>EDIT FILE</h2>

          <span className='meta-title'>DPI: <span> {DPI}</span></span>
          <span className='meta-title'>SIZE: <span>{sizeFile}</span> </span>
          <span className='meta-title'>FORMAT: <span>{orginalMetaData?.format}</span></span>
          <span className='meta-title'>WIDTH: <span>{width.toFixed(0)}</span>   </span>
          <span className='meta-title'>HEIGHT:  <span>{height.toFixed(0)}</span> </span>
          <h2>ORGINAL</h2>
          <span className='meta-title'>DPI:<span>{orginalMetaData?.dpi}</span> </span>
          <span className='meta-title'>SIZE:<span>{orginalMetaData?.size}</span></span>
          <span className='meta-title'>FORMAT:<span> {orginalMetaData?.format}</span> </span>
          <span className='meta-title'>WIDTH:<span>{orginalMetaData?.orginalWidth} </span></span>
          <span className='meta-title'>HEIGHT:<span>{orginalMetaData?.orginalHeight}</span> </span>
        </div>
        {!file ?
          <div className='img-board'>
            <span className='title-file'>Drop file here</span>
            or
            <label htmlFor='file'><MdCloudUpload size={50} color='grey' /></label>
            <input type='file' name='file' id='file' onChange={(e) => onAddImage(e)} />
          </div> :
          file
        }
        {mainFile &&
          mainFile
        }
        <div className='box-details flex-right'>
          {/* {console.log(orginalMetaData)} */}
          <div style={{position:'fixed', right:50, width:200, background:'white' , boxShadow:'0px 0px 16px 3px rgba(0,0,0,0.06)', padding:20}}>
           <div className='container-resolution'>

            <div className='flex-row'>

              <input type='number' style={{ width: 50 }} placeholder='0' defaultValue={width} value={width} onChange={(e) => {
                const target = parseInt(e.target.value)
                setWidth(target)
                setHeight(target / ratio)
              }
              } />
              <label>:width</label>
            </div>
            <div className='flex-row mt-2'>
              <input type='number' style={{ width: 50 }} defaultValue={height} value={height} onChange={(e) => {
                const target = parseInt(e.target.value)
                setHeight(target)
                setWidth(target / ratio)
              }}
              />
              <label>:height</label>
            </div>
              </div>

            <Slider onChangeSider={onChangeContrast} value={contrastVal} changeSlider={changeSlider} name='contrast' />
            <Slider onChangeSider={onChageSatration} value={saturationVal} changeSlider={changeSlider} name='saturation' />
            <Slider onChangeSider={onChageDarken} value={darkenVal} changeSlider={changeSlider} name='darken' />
            <Slider onChangeSider={onChangeLighten} value={ligthenVal} changeSlider={changeSlider} name='lighten' />
            <Slider onChangeSider={onChangeBrigten} value={brightenVal} changeSlider={changeSlider} name='brighten' />


          </div>
        </div>

      </div>

      <button onClick={() => contrast()}>contrast</button>
      <button onClick={() => size()}>resize</button>
    </div>
  )
}




function App() {

  const socketRef = useRef()
  const [ratio, setRatio] = useState(0)

  const [file, setFile] = useState()
  const [mainFile, setMainFile] = useState()
  const [fileChoose, setFileChoose] = useState()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [sizeFile, setSizeFile] = useState()
  const [DPI, setDPI] = useState()
  const [dpiOrginal, setOrginalDPI] = useState()
  const [sizeOrginal, setSizeOrginal] = useState()
  const [nameFile, setNameFile] = useState()
  const [orginalMetaData, setOrginalMetaData] = useState()
  const [contrastVal, setContrastVal] = useState(0)
  const [saturationVal, setSaturationVal] = useState(0)
  const [base64, setBase64] = useState()
  const [JIMP, setJIMP] = useState()
  const [ligthenVal, setLighten] = useState(0)
  const [darkenVal, setDarken] = useState(0)
  const [brightenVal, setBrighten] = useState(0)
  useEffect(() => {

    // socketRef.current = io.connect('/')

  }, [])
  useEffect(() => {
    console.log('jimp====>', JIMP);
  }, [JIMP])
  const onAddImage = (e) => {
    // const image = new FormData()
    // image.append('image', e.target.files[0])
    setNameFile(e.target.files[0].name)
    let reader = new FileReader();
    reader.onload = async function () {
      let dataURL = await reader.result;

      // var data= jimp.read(dataURL)
      // setJIMP(data)
      jimp.read(dataURL).then(async image => {
        
        console.log(image);
        
        // setOrginalDPI
        // setSizeOrginal
        // image.resize(400, jimp.AUTO)
        image.quality(50)
        const bs = await image.getBase64Async(image._originalMime);
        setFile(<img src={bs} width='400px' height='auto' />)
        setBase64(bs)
      })
      setMainFile(<img className='image-orginal' src={dataURL} width='400px' height='auto' />)
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  const onChangeContrast = async (e) => {
    const target = e.target.value > 50 ? 50 : e.target.value < -50 ? -50 : e.target.value
    setContrastVal(target)
  }


  const onChangeBrigten = (e)=>{
    const target = e.target.value > 100 ? 100 : e.target.value < 0 ? 0 : e.target.value
    setBrighten(target)
  }
    const  onChangeLighten = (e)=>{
      const target = e.target.value > 100 ? 100 : e.target.value < 0 ? 0 : e.target.value
      setLighten(target)
    }

  const onChageSatration = (e) => {
    const target = e.target.value > 100 ? 100 : e.target.value < 0 ? 0 : e.target.value
    setSaturationVal(target)
  }
  const onChageDarken = (e) => {
    const target = e.target.value > 100 ? 100 : e.target.value < 0 ? 0 : e.target.value
    setDarken(target)
  }


  const changeSlider = (name) => {
if(name === 'saturate'){

}else if(name==='darken'){

}else if(name==='lighten'){

}else if(name === 'brighten'){

}

    jimp.read(base64).then(async image => {
      console.log(base64);
      image.color([
        // { apply: 'ligthen', params: [ligthenVal] },
        { apply: 'saturate', params: [saturationVal] },
        { apply: 'darken', params: [darkenVal] },
        { apply: 'lighten', params: [ligthenVal] },
        { apply: 'brighten', params: [brightenVal] }
      ]);
      image.contrast(contrastVal / 100)
      const bs = await image.getBase64Async(image._originalMime);
      setFile(<img src={bs} width='400px' height='auto' />)
    })
  }
  return (
    <div className="App">
      <NavBar setWidth={setWidth} setHeight={setHeight} ratio={ratio} width={width} height={height} />
      <Board
        onChageDarken={onChageDarken}
        changeSlider={changeSlider}
        onChangeContrast={onChangeContrast}
        onChageSatration={onChageSatration}
        onChangeLighten={onChangeLighten}
        onChangeBrigten={onChangeBrigten}
brightenVal={brightenVal}
ligthenVal={ligthenVal}
        orginalMetaData={orginalMetaData}
        DPI={DPI}
        mainFile={mainFile}
        sizeFile={sizeFile}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        // size={size}
        onAddImage={onAddImage}
        file={file}
        // contrast={contrast}
        fileChoose={fileChoose}
        ratio={ratio}
        setRatio={setRatio}
        contrastVal={contrastVal}
        darkenVal={darkenVal}
        saturationVal={saturationVal}
      />
    </div>
  );
}

export default App;
