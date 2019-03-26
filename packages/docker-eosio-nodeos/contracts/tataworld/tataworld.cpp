#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class [[eosio::contract("tataworld")]] tataworld : public contract {
  public:
      using contract::contract;

      [[eosio::action]]
      void sendmsg(const std::string &msg) {
         print( "Hello, ", msg );
      }
};

EOSIO_DISPATCH( tataworld, (sendmsg) )
