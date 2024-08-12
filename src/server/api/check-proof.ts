import {HttpResponseResolver} from "msw";
import {CheckProofRequest} from "../dto/check-proof-request-dto";
import {TonApiService} from "../services/ton-api-service";
import {TonProofService} from "../services/ton-proof-service";
import {badRequest, ok} from "../utils/http-utils";
import {createAuthToken, verifyToken} from "../utils/jwt";

/**
 * Checks the proof and returns an access token.
 *
 * POST /api/check_proof
 */
export const checkProof: HttpResponseResolver = async ({request}) => {
  try {
    const requestJson = await request.json();
    const body = CheckProofRequest.parse(requestJson);
    console.log('requestJson', requestJson);
    console.log('body', body);

    const client = TonApiService.create(body.network);
    const service = new TonProofService();

    console.log('body.network', body.network);

    const isValid = await service.checkProof(body, (address) => client.getWalletPublicKey(address));
    if (!isValid) {
      return badRequest({error: 'Invalid proof'});
    }

    const payloadToken = body.proof.payload;
    console.log('payloadToken', payloadToken);

    if (!await verifyToken(payloadToken)) {
      return badRequest({error: 'Invalid token'});
    }

    const token = await createAuthToken({address: body.address, network: body.network});

    return ok({token: token});
  } catch (e) {
    return badRequest({error: 'Invalid request', trace: e});
  }
};
