import ByteArraySource from './byte-array-source.js'
import Color from './color.js'
import EmfOperation from './emf-operation.js'

export default class Emf {

    constructor(data) {
        this.objectMap = {};
        this.cap = "round";
        this.join = "round";
        this.penStyle = 0;
        this.penColor = Color.rgb(0, 0, 0);
        this.penWidth = 1;
        this.brushStyle = 0;
        this.brushColor = Color.rgb(0, 0, 0);

        this.header = {};
        this.emfOperations = [];
        this.parse(data);
    }

    parse(data) {
        let is = new ByteArraySource(data);
        this.readHeader(is);
        while(true) {
            let iType = is.readInt();
            let size = is.readInt();
            if (iType === 14) break; //END_OF_RECORD

            let recordData = is.readRaw(size - 8);
            this.parseMetaRecord(iType, recordData);
        }
    }


    readHeader(is) {
        let iType = is.readInt();
        if (iType !== 1) {
            throw "invalid magic number";
        }
        this.header.iSize = is.readInt();
        this.header.rclBoundsLeft = is.readInt();
        this.header.rclBoundsTop = is.readInt();
        this.header.rclBoundsRight = is.readInt();
        this.header.rclBoundsBottom = is.readInt();
        this.header.rclFrameLeft = is.readInt();
        this.header.rclFrameTop = is.readInt();
        this.header.rclFrameRight = is.readInt();
        this.header.rclFrameBottom = is.readInt();
        this.header.dSignature = is.readInt();
        this.header.nVersion = is.readInt();
        this.header.nBytes = is.readInt();
        this.header.nRecords = is.readInt();
        this.header.nHandles = is.readShort();
        is.readShort(); // sReserved
        this.header.nDescription = is.readInt();
        this.header.offDescription = is.readInt();
        this.header.nPalEntries = is.readInt();
        this.header.szlDeviceCx = is.readInt();
        this.header.szlDeviceCy = is.readInt();
        this.header.szlMillimetersCx = is.readInt();
        this.header.szlMillimetersCy = is.readInt();

        is.skip(this.header.iSize - this.header.offDescription);

        this.header.width = (this.header.rclBoundsLeft + this.header.rclBoundsRight) * 3;
        this.header.height = (this.header.rclBoundsTop + this.header.rclBoundsBottom) * 3;
    }

    parseMetaRecord(iType, recordData) {
        let recordIs = new ByteArraySource(recordData);

        switch (iType) {
            case 95: // EMR_EXTCREATEPEN
            {
                let ihPen = recordIs.readInt();
                this.objectMap[ihPen] = {iType:iType, params:recordData};
            }
                break;
            case 39: // EMR_CREATEBRUSHINDIRECT
            {
                let ihBrush = recordIs.readInt();
                this.objectMap[ihBrush] = {iType:iType, params:recordData};
            }
                break;
            case 82: // EMR_EXTCREATEFONTINDIRECTW
            {
                let ihFont = recordIs.readInt();
                this.objectMap[ihFont] = {iType:iType, params:recordData};
            }
                break;
            case 37: // EMR_SELECTOBJECT
            {
                let selectIndex = recordIs.readUnsignedShort();
                let obj = this.objectMap[selectIndex];
                if (obj == null) {
                    console.log("select null object");
                    break;
                }
                let objParamIs = new ByteArraySource(obj.params);
                let cr, cg, cb;
                switch (obj.iType) {
                    case 95: // select pen
                    {
                        objParamIs.readInt();
                        objParamIs.readInt(); // offBmi
                        objParamIs.readInt(); // cbBmi
                        objParamIs.readInt(); // offBits
                        objParamIs.readInt(); // cbBits

                        let penStyle = objParamIs.readInt();
                        switch (penStyle & 0x00000f00) {
                            case 0x00000000:
                                this.cap = "round";
                                break;
                            case 0x00000100:
                                this.cap = "square";
                                break;
                            case 0x00000200:
                                this.cap = "butt";
                                break;
                        }
                        switch (penStyle & 0x0000f000) {
                            case 0x00000000:
                                this.join = "round";
                                break;
                            case 0x00001000:
                                this.join = "bevel";
                                break;
                            case 0x00002000:
                                this.join = "miter";
                                break;
                        }
                        this.penStyle = penStyle & 0x0000000f;

                        this.penWidth = objParamIs.readInt();
                        objParamIs.readInt();
                        cr = objParamIs.readByte();
                        cg = objParamIs.readByte();
                        cb = objParamIs.readByte();
                        objParamIs.readByte();
                        this.penColor = Color.rgb(cr, cg, cb);
                    }
                        break;
                    case 39: // select brush
                    {
                        objParamIs.readInt();
                        this.brushStyle = objParamIs.readInt();
                        cr = objParamIs.readByte();
                        cg = objParamIs.readByte();
                        cb = objParamIs.readByte();
                        objParamIs.readByte();
                        this.brushColor = Color.rgb(cr, cg, cb);
                    }
                        break;
                    case 82: // select font
                    {
                    }
                        break;
                    default:
                        console.log("select unknown object:" + obj.iType);
                }
            }
                break;
            case 40: // EMR_DELETEOBJECT
            {
                let deleteIndex = recordIs.readUnsignedShort();
                this.objectMap[deleteIndex] = undefined;
            }
                break;
            case 90: // EMR_POLYPOLYLINE16
            case 91: // EMR_POLYPOLYGON16
            {
                recordIs.readInt(); // rclBounds
                recordIs.readInt();
                recordIs.readInt();
                recordIs.readInt();
                let numPolys = recordIs.readInt();
                let numTotalPoints = recordIs.readInt();
                let numPoints = [];
                let i,j;
                for (i = 0; i < numPolys; i++) {
                    numPoints[i] = recordIs.readInt();
                }

                for (i = 0; i < numPolys; i++) {
                    let pointList = [];
                    for (j = 0; j < numPoints[i]; j++) {
                        pointList.push({x:recordIs.readShort(), y:recordIs.readShort()});
                    }

                    this.emfOperations.push(new EmfOperation(iType, {
                        pointList : pointList,
                        brushColor : this.brushColor,
                        penColor : this.penColor,
                        penWidth : this.penWidth,
                        brushStyle : this.brushStyle,
                        penStyle : this.penStyle,
                        cap : this.cap,
                        join : this.join,
                        miter : this.miter
                    }));
                }
            }
                break;
            case 58: // SETMITERLIMIT
                this.miter = recordIs.readInt();
                break;
            case 62: // EMR_FILLPATH
            case 63: // EMR_STROKEANDFILLPATH
            case 64: // EMR_STROKEPATH
                this.emfOperations.push(new EmfOperation(iType, {
                    brushColor : this.brushColor,
                    penColor : this.penColor,
                    penWidth : this.penWidth,
                    brushStyle : this.brushStyle,
                    penStyle : this.penStyle,
                    cap : this.cap,
                    join : this.join,
                    miter : this.miter
                }));
                break;
            case 59: // EMR_BEGINPATH
                this.emfOperations.push(new EmfOperation(iType));
                break;
            case 27: // EMR_MOVETOEX
            {
                let x = recordIs.readInt();
                let y = recordIs.readInt();
                this.emfOperations.push(new EmfOperation(iType, {
                    x : x,
                    y : y
                }));
            }
                break;
            case 60: // EMR_ENDPATH
                break;
            case 61: // EMR_CLOSEFIGURE
                this.emfOperations.push(new EmfOperation(iType));
                break;
            case 88: // EMR_POLYBEZIERTO16
            {
                recordIs.readInt(); // rclBounds
                recordIs.readInt();
                recordIs.readInt();
                recordIs.readInt();
                let numPoints = recordIs.readInt();
                let pointList = [];
                for (let i = 0; i < numPoints; i++) {
                    pointList.push({x:recordIs.readShort(), y:recordIs.readShort()});
                }
                this.emfOperations.push(new EmfOperation(iType, {
                    pointList : pointList
                }));
            }
                break;
            case 36: // EMR_MODIFYWORLDTRANSFORM
            {
                let eM11 = recordIs.readFloat();
                let eM12 = recordIs.readFloat();
                let eM21 = recordIs.readFloat();
                let eM22 = recordIs.readFloat();
                let eDx = recordIs.readFloat();
                let eDy = recordIs.readFloat();
                let iMode = recordIs.readInt();

                this.emfOperations.push(new EmfOperation(iType, {
                    eM11 : eM11,
                    eM12 : eM12,
                    eM21 : eM21,
                    eM22 : eM22,
                    eDx : eDx,
                    eDy : eDy
                }));
            }
                break;
            case 35: // EMR_SETWORLDTRANSFORM
                this.emfOperations.push(new EmfOperation(iType));
                break;
            case 9: // EMR_SETWINDOWEXTEX
                // ignore
                break;
            case 10: // EMR_SETWINDOWORGEX
                // ignore
                break;
            case 12: // EMR_SETVIEWPORTORGEX
                // ignore
                break;
            case 11: // EMR_SETVIEWPORTEXTEX
                // ignore
                break;
            case 17: // EMR_SETMAPMODE
                // ignore
                break;
            case 18: // EMR_SETBKMODE
                // ignore
                break;
            case 19: // EMR_SETPOLYFILLMODE
                // ignore
                break;

            case 67: // EMR_SELECTCLIPPATH
                // ignore
                break;
            case 81: // EMR_STRETCHDIBITS
                // ignore
                break;
            case 6: // EMR_POLYLINETO
                // ignore
                break;
            case 33: // EMR_SAVEDC
                // ignore
                break;
            case 34: // EMR_SAVEDC
                // ignore
                break;
            default:
                console.log(iType);
                break;
        }
    }
}
