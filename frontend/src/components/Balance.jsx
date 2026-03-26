export const Balance = ({value}) => {
    return (<div className="flex">
        <div className="text-lg font-bold">
            Your balance
        </div>
        <div className="text-lg font-semibold ml-4">
            Rs {value}
        </div>
    </div>);
}