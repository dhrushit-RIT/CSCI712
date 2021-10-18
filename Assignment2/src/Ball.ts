class Ball extends THREE.Mesh {

    static BALL_DIM_FT = 1;
    // static BALL_DIM_FT = 0.0859375;

    private radius: number;
    private initialvelocity: number;
    private xVel: number;
    private yVel: number;
    private zVel: number;
    private finalvelocity: number;
    private angvelocity: number;
    private force: number;
    private rotation_deg: number;
    private rotation_rad: number;
    private friction: number;
    private momentum: number;
    private angularmoment: number;
    private mass: number;
    private acceleration: number;
    private angacceleration: number;
    private prevpostion: number;

    // this.initialvelocity= 1;


    constructor(radius: number) {
        const geometry_ball = new THREE.SphereGeometry(Ball.BALL_DIM_FT, 32, 32);
        const material_ball = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        super(geometry_ball, material_ball);
        this.radius = radius;
    }

    setParamsball() {

        this.rotation_deg = 35;
        this.initialvelocity = 1;
        this.rotation_rad = toRadians(this.rotation_deg);
        this.xVel = Math.cos(this.rotation_rad) * this.initialvelocity;
        this.zVel = Math.sin(this.rotation_rad) * this.initialvelocity;
        // let zVel = 1;
        this.friction = 0.3;

        const axis = new THREE.Vector3();

        axis.set(this.xVel, 0, this.zVel).normalize();
        axis.cross(THREE.Object3D.DefaultUp);

        // this.xVel *= this.friction; 
        // this.zVel *= this.friction;

        const totalVelocity = Math.sqrt(this.xVel * this.xVel + this.zVel * this.zVel);
        const angle = -totalVelocity / (Math.PI * this.radius) * Math.PI;
        // geometry_ball.rotateOnAxis( axis, angle );

        let vels = new THREE.Vector3(this.xVel, 0, this.zVel);
        return vels;

    }


    myUpdate() {

        let vels = this.setParamsball();

        vels.x *= 0.7;
        vels.z *= 0.7;

        // add velocity to ball
        this.position.x += vels.x;
        this.position.y += 0;
        this.position.z += vels.z;

    }

    exertForce() { }
}

interface IBall {
    exertForce(): void;
}
