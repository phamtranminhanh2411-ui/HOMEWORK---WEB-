export class Fashion{
    public IdF:number|null=null;
    public slug:string="";
    constructor(
        public _id:any=null,
        public style:string="",
        public fashion_subject:string="",
        public fashion_detail:string="",
        public fashion_image:string=""){}
    getBase64String(){
        if (/^(https?:\/\/|data:image)/i.test(this.fashion_image)
            || (this.fashion_image.startsWith('/') && !this.fashion_image.startsWith('/9j/'))) return this.fashion_image;
        if (!this.fashion_image.startsWith("data:image")) {
    return "data:image/png;base64," + this.fashion_image;
    }
    return this.fashion_image;
    }
}

