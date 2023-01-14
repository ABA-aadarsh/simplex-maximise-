const calc=document.querySelector("#calculate")
const resultContainer=document.querySelector("#result")
const box=document.querySelector(".box")
box.classList.add("hidden")
let data=[]
let flag=false
let pivot={
    pivotColumn:null,
    pivotRow:null,
    val:["R","S"]
}
const generateTable=()=>{
    const table=document.createElement("div")
    table.classList.add("table")
    const content=`
        <!-- heading row -->
        <span style="border-radius:7px 0px 0px 0px;">B.V</span>
        <span>X</span>
        <span>Y</span>
        <span>R</span>
        <span>S</span>
        <span>Z</span>
        <span style="border-radius:0px 7px 0px 0px;">R.H.S</span>
        <!-- row 1 -->
        <span>${pivot.val[0]}</span>
        <span>${(Math.floor((data[0][0])*10000))/10000}</span>
        <span>${(Math.floor((data[0][1])*10000))/10000}</span>
        <span>${(Math.floor((data[0][2])*10000))/10000}</span>
        <span>${(Math.floor((data[0][3])*10000))/10000}</span>
        <span>${(Math.floor((data[0][4])*10000))/10000}</span>
        <span>${(Math.floor((data[0][5])*10000))/10000}</span>
        <!-- row 2 -->
        <span>${pivot.val[1]}</span>
        <span>${(Math.floor((data[1][0])*10000))/10000}</span>
        <span>${(Math.floor((data[1][1])*10000))/10000}</span>
        <span>${(Math.floor((data[1][2])*10000))/10000}</span>
        <span>${(Math.floor((data[1][3])*10000))/10000}</span>
        <span>${(Math.floor((data[1][4])*10000))/10000}</span>
        <span>${(Math.floor((data[1][5])*10000))/10000}</span>
        <!-- row 3 -->
        <span style="border-radius:0px 0px 0px 7px;"></span>
        <span>${(Math.floor((data[2][0])*10000))/10000}</span>
        <span>${(Math.floor((data[2][1])*10000))/10000}</span>
        <span>${(Math.floor((data[2][2])*10000))/10000}</span>
        <span>${(Math.floor((data[2][3])*10000))/10000}</span>
        <span>${(Math.floor((data[2][4])*10000))/10000}</span>
        <span style="border-radius:0px 0px 7px 0px;">${(Math.floor((data[2][5])*10000))/10000}</span>
    `
    table.innerHTML=content
    resultContainer.appendChild(table)
}
const appendMessage=(message)=>{
    const m=document.createElement("p")
    m.classList.add("stepDefinition")
    m.innerHTML=message
    resultContainer.appendChild(m)
}
const fetch=()=>{
    let validity=true
    const a1=parseFloat(document.querySelector("#a1").value)
    const a2=parseFloat(document.querySelector("#a2").value)
    const cnst=[...document.querySelectorAll(".c")]
    const arr=[
        [a1,a2],
        [parseFloat(cnst[0].value),parseFloat(cnst[1].value),parseFloat(cnst[2].value)],
        [parseFloat(cnst[3].value),parseFloat(cnst[4].value),parseFloat(cnst[5].value)],
    ]
    for(let i=0;i<3;i++){
        arr[i].forEach((x,j)=>{
            if(isNaN(x)){
                validity=false
            }
        })
        if(validity==false){
            break
        }
    }
    if(validity==true){
        return arr
    }else{
        return false
    }
}
const standardise=(i)=>{
    const arr=[
        [i[1][0]  , i[1][1], 1, 0, 0, i[1][2]],
        [i[2][0]  , i[2][1], 0, 1, 0, i[2][2]],
        [-i[0][0] ,-i[0][1], 0, 0, 1, 0]
    ]
    return arr
}
const findPivotColumn=()=>{
    let Lentry=[
        [data[2][0],0],
        [data[2][1],1]
    ]
    Lentry.sort((a,b)=>{
        return a[0]-b[0]
    })
    // console.log(Lentry)
    if(Lentry[0][0]>=0){
        return null
    }else{
        if(Lentry[0][1]==0){
            appendMessage("Here X is the Pivot Column.")
        }else{
            appendMessage("Here Y is the Pivot Column.")
        }
        return Lentry[0][1]
    }
}
const findPivotRow=()=>{
    // const e1=data[0][pivot.pivotColumn]
    // const e2=data[1][pivot.pivotColumn]
    const arr=[
        [data[0][5]/(data[0][pivot.pivotColumn]),0],
        [data[1][5]/(data[1][pivot.pivotColumn]),1]
    ]
    arr.sort((a,b)=>{
        return a[0]-b[0]
    })
    // we need to find the least positive number (not negative, not zero)
    if(arr[0][0]<=0){
        // return another item's index
        return arr[1][1]
    }else{
        return arr[0][1]
    }
}
const solveNextStep=()=>{
    const otherRow=[0,1,2]
    otherRow.splice(otherRow.indexOf(pivot.pivotRow),1)
    const a=data[pivot.pivotRow][pivot.pivotColumn]
    appendMessage(`R<sub>${pivot.pivotRow+1}</sub> &#8594 R<sub>${pivot.pivotRow+1}</sub> / (${(Math.floor(a*10000))/10000})`)
    // making the pivot element 1
    for(let i=0;i<6;i++){
        data[pivot.pivotRow][i]/=a
    }
    generateTable()
    // subtracting other two rows in order to make other numbers 0 that lies in the same column of pivot element
    const a1=data[otherRow[0]][pivot.pivotColumn]
    const a2=data[otherRow[1]][pivot.pivotColumn]
    appendMessage(`
        R<sub>${otherRow[0]+1}</sub> &#8594 R<sub>${otherRow[0]+1}</sub> - (${(Math.floor(a1*10000))/10000})*R<sub>${pivot.pivotRow+1}</sub>
    `)
    appendMessage(`
        R<sub>${otherRow[1]+1}</sub> &#8594 R<sub>${otherRow[1]+1}</sub> - (${(Math.floor(a2*10000))/10000})*R<sub>${pivot.pivotRow+1}</sub>
    `)
    for(let i=0;i<6;i++){
        data[otherRow[0]][i]-=(a1*(data[pivot.pivotRow][i]))
        data[otherRow[1]][i]-=(a2*(data[pivot.pivotRow][i]))
    }
    generateTable()
}
const simplex=()=>{
    pivot.pivotColumn=findPivotColumn()
    if(pivot.pivotColumn==null){
        // i.e optimal soln is obtained
        let x=0,y=0
        if(pivot.val.indexOf("X")!=-1){
            x=data[pivot.val.indexOf("X")][5]
        }
        if(pivot.val.indexOf("Y")!=-1){
            y=data[pivot.val.indexOf("Y")][5]
        }
        appendMessage("Since all entries in last row are non-negative, optimal soln is obtained.")
        appendMessage(`Maximise (Z) = <span style="color:#1717a8;">${data[2][5]}</span>`)
        appendMessage(`at X = <span style="color:#1717a8;">${Math.floor(x*10000)/10000}</span> and Y = <span style="color:#1717a8;">${Math.floor(y*10000)/10000}</span>`)
        flag=true
    }else{
        // now find the pivot row (data[pivotRow][pivotColumn]=pivot Element)
        pivot.pivotRow=findPivotRow()
        if(pivot.pivotRow==0){
            if(pivot.pivotColumn==0){
               pivot.val[0]="X" 
            }else{
                pivot.val[0]="Y"
            }
        }else{
            if(pivot.pivotColumn==0){
                pivot.val[1]="X" 
             }else{
                 pivot.val[1]="Y"
             }
        }
        appendMessage(`Here R<sub>${pivot.pivotRow+1}</sub> is the Pivot Row and 
        ${Math.floor(data[pivot.pivotRow][pivot.pivotColumn]*10000)/10000} is the pivot Element.`)
        solveNextStep()
    }
}
calc.addEventListener("click",()=>{
    // fetch data
    flag=false
    resultContainer.innerHTML=""
    pivot={
        pivotColumn:null,
        pivotRow:null,
        val:["R","S"]
    }
    box.classList.add("hidden")
    data =fetch()
    if(data!=false){
        // standardising data for simplex method
        data=standardise(data)
        generateTable()
        while(flag==false){
            simplex()
        }
        box.classList.remove("hidden")
    }else{
        appendMessage(`<p style="color:red;">Please give proper inputs.</p>`)
        box.classList.remove("hidden")
    }
})
