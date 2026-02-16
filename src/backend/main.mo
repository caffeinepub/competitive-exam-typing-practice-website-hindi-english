import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Language = {
    #english;
    #hindi;
  };

  type Passage = {
    text : Text;
    language : Language;
  };

  type Session = {
    passage : Passage;
    result : {
      timeTaken : Nat;
      accuracy : Float;
    };
  };

  let passages = List.fromArray<Passage>(
    [
      { text = "The quick brown fox jumps over the lazy dog."; language = #english },
      { text = "भारत एक महान देश है।"; language = #hindi },
    ]
  );

  let sessions = Map.empty<Nat, Session>();

  public query ({ caller }) func getPassagesByLanguage(language : Language) : async [Passage] {
    passages.values().toArray().filter(
      func(passage) {
        passage.language == language;
      }
    );
  };

  var sessionId = 0;

  public shared ({ caller }) func recordSession(session : Session) : async Nat {
    let id = sessionId;
    sessions.add(id, session);
    sessionId += 1;
    id;
  };
};
