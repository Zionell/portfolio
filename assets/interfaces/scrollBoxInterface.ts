export interface IAxisAttrs {
    clientAttr: string,
    offsetAttr: string,
    offsetSizeAttr: string,
    scrollSizeAttr: string,
    scrollOffsetAttr: string,
    scrollbarSize: number,
    click: number,
}

interface IAxisX extends IAxisAttrs{
    scrollLeft: number,
}
interface IAxisY extends IAxisAttrs{
    scrollTop: number,
}

export interface IAxisDir {
    x: IAxisX
    y: IAxisY
}

export interface IDimensions {
    boxHeight: number,
    boxWidth: number,
    contentHeight: number,
    contentWidth: number,
    yRailHeight: number,
    yThumbHeight: number,
    xRailWidth: number,
    xThumbWidth: number,
}