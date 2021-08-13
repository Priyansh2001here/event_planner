import React, { useState,useEffect } from "react";

function PeopleInEvent({pie}) {
  const [people, setPeople] = useState([]);


useEffect(() => {
    if(pie.participants.length > 3){
        setPeople(pie.participants.slice(0,3));
        // setpeopleLeft(pie.length - 3);
      }else if(pie.length == 3){
        setPeople(pie.participants);
      }else{
        setPeople(pie.participants);
      }
}, [])



  return (
    <div>
      <div className="peopleInEvent">
        {people.length ? people.map((p,index) => <img src={"/media/" + p.prof_img} key={p.full_name} className={`img${index+1}`} alt={p.full_name} /> ): ''}
        <p style={people.length !== 1 ? { marginLeft: "5px" } :  { marginLeft: "0px",  left:"35px", bottom:"-4px"}}>
          {people.length === 1 ? people[0].full_name + ' is in this event' : people.length === 2 ? people[0].full_name + " and " + people[1].full_name + " are in this event" : people.map(p => ' ' +  p.full_name ) + ' are in this event' }
        </p>
      </div>
    </div>
  );
}

export default PeopleInEvent;