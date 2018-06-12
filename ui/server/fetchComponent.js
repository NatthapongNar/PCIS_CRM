// ui/server/fetchComponent.js

// อีกซักครู่เราจะเรียกใช้งานฟังก์ชันนี้
// ฟังก์ชันนี้รับพารามิเตอร์สามตัว
// - dispatch คือ store.dispatch ใช้เพื่อส่ง action เข้าไป
// - components คือคอมโพแนนท์ที่เกี่ยวข้องทั้งหมด
// - params คือค่าต่างๆจาก router ที่เกี่ยวข้องกับ URL เช่นถ้าเราอยู่ที่ /pages/1 จะได้ว่า params.id คือ 1
export function fetchComponent(dispatch, components, params) {
    const needs =
        components
            // ในบรรดาคอมโพแนนท์ทั้งหมดที่ส่งเข้ามา เอาเฉพาะคอมโพแนนท์ที่มีค่า
            // เป็นการป้องกันกรณี components มี null หรือ undefined ปนอยู่ด้วย
            .filter(component => component)
            .reduce((prev, current) => {
                // จำได้ไหมเอ่ย เราบอกว่าหน้าที่ดึงข้อมูลจะต้องเป็นของ Container Component
                // Container Component ไหนมีการใช้ connect แสดงว่าตัวนั้นเกี่ยวข้องกับ state
                // เราจะเลือกเฉพาะ container Component ที่เกี่ยวข้องกับ state 
                // คือมีการเรียกใช้ connect(mapStateToProps, mapDispatchToProps) นั่นเอง
                // connect เป็นฟังก์ชันที่คืนค่ากลับมาเป็นอีกคอมโพแนนท์ที่ครอบทับคอมโพแนนท์เดิมที่ส่งเข้าไป
                // เช่น connect(...)(FooComponent) จะได้คอมโพแนนท์ใหม่ที่สร้างครอบทับ FooComponent
                // เราสามารถเข้าถึงคอมโพแนนท์เดิมได้จากการเรียก [คอมโพแนนท์ใหม่].WrappedComponent
                // เราจึงใช้ WrappedComponent เป็นตัวทดสอบว่าคอมโพแนนท์นั้นผ่านการเรียก connect รึเปล่า
                // ถ้าผ่านการเรียก มันจะมี WrappedComponent อยู่ในตัวมัน
                // ย้ำอีกครั้ง ที่เราต้องทำแบบนี้เพราะเราจะจัดการดึงข้อมูลเฉพาะ Container Component 
                // ที่มีการเรียก connect นั่นเอง
                const wrappedComponent = current.WrappedComponent

                // เราจะรวบรวมฟังก์ชันที่อยู่ภายใต้ need ของแต่ละ Container Component
                return (current.need || [])
                    .concat(
                    (wrappedComponent && wrappedComponent.need) || []
                    )
                    .concat(prev)
            }, []
            )

    // ใช้ Promise.all เพื่อรอให้ข้อมูลตอบกลับมาทั้งหมดจาก API Server ก่อน
    // จากนั้นจึงคืนค่ากลับออกไปจากฟังก์ชัน
    // อย่าลืมว่าเราต้องมีข้อมูลพร้อมทั้งหมดก่อน ถึงจะแสดงผลได้ด้วย SSR
    // สังเกตว่าเราส่ง params เข้าไปใน need ด้วย นั่นคือในแต่ละฟังก์ชันภายใต้ need ของเราจะเข้าถึง params ได้
    return Promise.all(needs.map(need => dispatch(need(params))))
}